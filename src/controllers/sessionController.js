const shared = require("../shared");
const PgpCrypt = require("../utils/encryption/PgpCrypt");
const certificatesVerifier = require("../../level5/cer_verifier");
const verifier = require("../../level5/verifier");
const forge=require('node-forge');
require("dotenv").config();
class Session {
  async handshaking(data, socket) {
    const { publicKey, privateKey } = await PgpCrypt.generatePairKeys();
    const findUser = shared.users.filter((x) => x.socket.id == socket.id);
    process.env.privateKey = privateKey;
    const isVefy = verifier.verifyCertificate(data.certificat);
    if (!isVefy) {
      console.log("not veried");
      return;
    }
    const certificate = forge.pki.certificateFromPem(data.certificat);
   if(certificate.subject.getField('CN').value.includes("Dr")){
    console.log("doctor registerd");
   }else
   console.log("user registerd");

    
 
    findUser[0].user.publicKey = data.publicKey;
console.log(forge.pki.publicKeyToPem(certificate.publicKey));
console.log(data.publicKey);
    if (publicKey) socket.emit("handshaking", { publicKey: publicKey });
  }

  checkSessionKey(data, socket) {
    const findUser = shared.users.filter((x) => x.socket.id == socket.id);
    const dycryptedData = PgpCrypt.decrypt(data.SessionKey);

    findUser[0].user.SessionKey = dycryptedData;
    socket.emit("Acceptance-session-key", {
      Accept: true,
    });
  }

  async reciveCsr(data, socket) {
    const cert = await certificatesVerifier.verifiyCSR(data, socket);
    if (cert) {
      const findUser = shared.users.filter((x) => x.socket.id == socket.id);
      findUser[0].user.certificat = cert;
      socket.emit("sendcertificat", cert);
    }
  }
}
module.exports = new Session();
