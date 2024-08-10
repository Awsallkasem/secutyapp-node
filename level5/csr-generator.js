module.exports = {
    generateCSR: (privateKey, publicKey) => {
  
      const forge = require("node-forge");
      const pki = forge.pki;
  
  
      const prKey = pki.privateKeyFromPem(privateKey);
      const pubKey = pki.publicKeyFromPem(publicKey);
  
      
  
      // create a certification request (CSR)
      const csr = forge.pki.createCertificationRequest();
      csr.publicKey = pubKey;
      csr.setSubject([
        {
          name: "commonName",
          value: "Iss.org",
        },
       
        {
          name: "organizationName",
          value: "ITE",
        },
        
      ]);


     
      // sign certification request
      csr.sign(prKey);

      const pem = forge.pki.certificationRequestToPem(csr);
      
      return pem;
    },
  };