const attrs = [
  {
    name: "commonName",
    value: "Iss.org",
  },

  {
    name: "organizationName",
    value: "DAMASCUS UNIVERSITY",
  },
];

// Creating built-in CA store
async function Creating_built_in_CA_store() {
  // Libs
  const rsaHandler = require("./rsa_handler");

  const Keys = rsaHandler.generatePublicPrivatePairOfKeys();
  const RootCAPrivateKey = Keys.privateKey;
  const RootCAPublicKey = Keys.publicKey;
  process.env.PrvCA = RootCAPrivateKey;
  process.env.PubCA = RootCAPublicKey;

  // Generate CA certificate
  const certificatesGenerator = require("./certificate_generator");

  const CA = certificatesGenerator.generateCertificate(
    process.env.PrvCA,
    process.env.PubCA,
    attrs
  );
  process.env.CAPem = CA;
 
}
Creating_built_in_CA_store();
