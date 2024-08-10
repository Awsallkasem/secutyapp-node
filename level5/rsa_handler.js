const crypto = require("crypto");

const generatePublicPrivatePairOfKeys = () => {
  // The `generateKeyPairSync` method accepts two arguments:
  // 1. The type of keys we want, which in this case is "rsa"
  // 2. An object with the properties of the key
  return crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      
    }
  });
};



module.exports = {
    generatePublicPrivatePairOfKeys,
};