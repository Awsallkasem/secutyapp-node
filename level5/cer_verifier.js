const UserRepository = require("../src/repositories/UserRepository");

module.exports = {
  verifiyCSR: async (csrPem, socket) => {
    const forge = require("node-forge");

    const csr = forge.pki.certificationRequestFromPem(csrPem);
    // Read CA cert and key

    const caCertPem = process.env.CAPem;
    const caKeyPem = process.env.PrvCA;
    const caCert = forge.pki.certificateFromPem(caCertPem);
    const caKey = forge.pki.privateKeyFromPem(caKeyPem);
    const user = await UserRepository.getUser(socket);
    let name = csr.subject.getField("CN").value.includes("Dr")
      ? `Dr ${user.username}`
      : user.username;

    try {
      if (user) {
        console.log(name);
        console.log(csr.subject.getField("CN").value);
        console.log(csr.subject.getField("CN").value.includes("Dr"));
        if (
          (csr.subject.getField("CN").value.includes("Dr") &&
            !user.isDocotor) ||
          (!csr.subject.getField("CN").value.includes("Dr") && user.isDocotor)
        ) {
          throw new Error("Signature not verified.");
        }

        if (
          csr.subject.attributes[3].value != user._id ||
          csr.subject.getField("CN").value != name
        ) {
          throw new Error("Signature not verified.");
        }
      }
      if (csr.verify()) {
        console.log("Certification request (CSR) verified.");
      } else {
        throw new Error("Signature not verified.");
      }
    } catch (e) {
      console.log(e);
      return false;
    }

    console.log("Creating certificate...");
    const cert = forge.pki.createCertificate();
    cert.serialNumber = new Date().getTime().toString();

    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    // subject from CSR
    cert.setSubject(csr.subject.attributes);
    // issuer from CA
    cert.setIssuer(caCert.subject.attributes);

    cert.setExtensions([
      {
        name: "basicConstraints",
        cA: false,
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
    ]);

    cert.publicKey = csr.publicKey;

    cert.sign(caKey);

    return forge.pki.certificateToPem(cert);
  },
};
