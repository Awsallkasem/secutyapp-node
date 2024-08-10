module.exports = {
  verifyCertificate: (certPem) => {
    const log = console.log;
    const pki = require("node-forge").pki;

    let caCert;
    let caStore;

    try {
      caCert = process.env.CAPem;
JSON.stringify(caCert);
      // Create an array with the CA certificate
      caStore = pki.createCaStore([caCert]);

    } catch (e) {
      return false;
    }

    try {
      const certToVerify = pki.certificateFromPem(certPem);

      const verified = pki.verifyCertificateChain(caStore, [certToVerify]);

      if (verified) {
        log("Certificate got verified successfully.!");
      }

      return verified;
    } catch (e) {
      log("Failed to verify certificate (" + (e.message || e) + ")");
      return false;
    }
  },
};
