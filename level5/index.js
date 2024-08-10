// Certificate Signing Request handler
const createCSR = async (privateKey, publicKey) => {
    // Initiating certificate signing request
    const csrGenerator = require("./csr-generator");
    const CSR = csrGenerator.generateCSR(privateKey, publicKey);
  
    // verifying csr by certification authority and getting a CA certificate
    const certificatesVerifier = require("./cer_verifier");
    const cert = await certificatesVerifier.verifiyCSR(CSR);
  
    console.log(`Cer from index ${cert}`)
    // Writting CA certificate to a file, so we can use it a bit latter
    process.env.ourCertificate=cert
  };
  
  const rsaHandler = require('./rsa_handler.js');
   const {
      privateKey,
      publicKey,
    } = rsaHandler.generatePublicPrivatePairOfKeys();
  
  createCSR(privateKey, publicKey);
 