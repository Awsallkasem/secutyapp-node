const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");

class PGPCrypto {
  async generatePairKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    const exportedPublicKeyBuffer = publicKey.export({
      type: "pkcs1",
      format: "pem",
    });
    const exportedPrivateKeyBuffer = privateKey.export({
      type: "pkcs1",
      format: "pem",
    });
  
    console.log(`publicKey:  ${exportedPublicKeyBuffer}`);
    console.log(`privateKey:  ${exportedPrivateKeyBuffer}`);
    return {
      publicKey: exportedPublicKeyBuffer,
      privateKey: exportedPrivateKeyBuffer,
    };
  }
  async getKeysOfServer() {
    process.env.PublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz6eIhADfbzhhGS245B60
9QpB3x86cJUVhikT9wmyYuMJ/+nZkgm2IiilWrXTjS5HR8jsI5Bgr3j1W75dTKJt
vWggbyRYJEbG5ZtSPqOcIkE4Hf3SW/dw+E09hf+xmGjWdx6DYTssMXnwjyFKGZlC
jkjTWLTSbNl++5Fabg00jXA0k0FT0gC+D4kDg3w3HJR4n+vKw1hexpOmxLPXYZda
YvlFELtm6hGqUcKz1YiL+GK7Eurr/vG7tla88kW480YocvbiRw2wDsKRgcjZBgcV
fZqSJPMBY7wuOocPupX8Xd/aONj9I/d0kzDRs8SxXVAWbZopsD24AEA8zrBXV1QZ
NwIDAQAB
-----END PUBLIC KEY-----`;
    process.env.PrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPp4iEAN9vOGEZ
LbjkHrT1CkHfHzpwlRWGKRP3CbJi4wn/6dmSCbYiKKVatdONLkdHyOwjkGCvePVb
vl1Mom29aCBvJFgkRsblm1I+o5wiQTgd/dJb93D4TT2F/7GYaNZ3HoNhOywxefCP
IUoZmUKOSNNYtNJs2X77kVpuDTSNcDSTQVPSAL4PiQODfDcclHif68rDWF7Gk6bE
s9dhl1pi+UUQu2bqEapRwrPViIv4YrsS6uv+8bu2VrzyRbjzRihy9uJHDbAOwpGB
yNkGBxV9mpIk8wFjvC46hw+6lfxd39o42P0j93STMNGzxLFdUBZtmimwPbgAQDzO
sFdXVBk3AgMBAAECggEAAjpkXWY7ZeocJwHPYtzUr2+b8IgmDGDNIx9ig3TeYSLZ
tjemif0CSbBXj3c1lrI3n/soukj2TWuy1kUr1k933F+dpkbX9N7j8drBl/WrDmlv
7+jYgcjp58zyxNlPHB+KQMTz2Ls8NVuyZRbD8/pdAg6hL4NHlSHQTWRSrOBsMlUY
689MI4+AOokcJE2kGIiIV5O4WweWmY42+PAkLWEbkjoEv3x0efw0aI4b8uYBvZRV
ntCDKDkKGgBL6XjngpQXD8I6fZqoDc2Ow93XNLF3/12PunuJQ5VbJFwyeNKQN75p
ox750rMCae03CwF6O0K9eWepDAsnwAazINW6vSPrIQKBgQDWn3nD9lV+zZRbcc44
pllgHwHUZkQupTiOYNr8LLe4xGaeQ0PKkVdmOKYVF5AYUcxWSj3zQVmxwXOt4pLS
qsV1m94y1TNqzKAWVEYfEw5CQGmojwPN+/mdp793V3Y4AwRFYpt5oRygo82GkUeY
ncKIMf7JVVusicKIIGAGubte8wKBgQD3sCHdc9POY4sga1Cm4Xg6ietxbkhPKvYi
TzNRMAmD3TF1niO/R+EA1hVyZeL1ZzcohApTDHLJpotIFTn38iZmTJQ52D4lDf+d
5jpBCSbhf1FHWVU6IhLUGUgqgn4Kk9tesL0GQCYlJDzJvmdivuhyOJKeycWUD6pI
N8INwCkVrQKBgQC3Wf54fxWDArXfeVYn51UrXNH/Vm6hOt0aJXxvOvSpkH/qbKSZ
hZkY5wRbuImNfTQH890A1698wDvHLW0pNGMEmmg1HRaUAsQwz0YofesMhmK9cZBa
hQ02tnxHxBxmtY0MibUxL4Z5ZfbLI4n6w6vRFoUIEzgCKp5aFO50UG/WKQKBgDSC
rMtMMQ1CYU6AMdsPVfPjJX0oyj+udfwUGmcN7hZ8oG21FxMIZBVPTcCxBQrN1Q3L
4Hx22ScTHdgsV9vPBIEPnyUcSSCF9Tk+g/8ht5J68XpU4BKxApjgu0H35EzNx+Yt
RgW7N9sL8a87pKN0occFY2AymqanI4yn9YYAxTUJAoGAYjdB0IfF3Rl6QJprjyFQ
YFRqfw69gHQIR8+akZW1KNQDyWmV6RNBdxXXFyA8sdCUWx9yTf9JGy8TNLYbzPvd
ICytX8P9noYZNzEdTO4nzs4plnAZJX0kQWPILFGT8LcIaW0dvQ+IneC1nCJggp13
Lf/jD21DJxw0s7IaG60mURI=
-----END PRIVATE KEY-----`;
  }
  encrypt(text) {
    const crypt = new JSEncrypt();
    crypt.setKey(process.env.PublicKey);
    return crypt.encrypt(text);
  }

  decrypt(encrypted) {
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(process.env.privateKey);
    return crypt.decrypt(encrypted);
  }


 
}
module.exports = new PGPCrypto();
