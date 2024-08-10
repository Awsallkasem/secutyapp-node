const err = require("./errorController");
const shared = require("../shared/index");
const forge = require("node-forge");
const UserRepository = require("../repositories/UserRepository");
const SessionEncryption = require("../utils/encryption/level3");
const MarksRepository = require("../repositories/MarksRepository");

class DoctorConroller {
  async getstudents(socket) {
    const students = await UserRepository.getStudants();
    const users = shared.users;

    const fromUser = users.filter((x) => x.socket.id == socket.id);
    const encryptData = SessionEncryption.EncryptData(
      JSON.stringify(students),
      fromUser[0].user.SessionKey
    );

    const mac = await SessionEncryption.generateMac(
      JSON.stringify(encryptData)
    );
    socket.emit("students", {
      containt: encryptData,
      mac: await SessionEncryption.generateMac(encryptData),
    });
  }

  async setMarks(data, socket) {
    const { signatureBase64, containt } = data;
    const findUser = shared.users.filter((x) => x.socket.id == socket.id);
    const pubKey = findUser[0].user.publicKey;

    const publicKey = forge.pki.publicKeyFromPem(pubKey);
    const md = forge.md.sha256.create();
    md.update(containt, "utf8");
    const hash = md.digest();

    // Decode the Base64-encoded signature
    const signature = forge.util.decode64(signatureBase64);
    const verified = publicKey.verify(hash.getBytes(), signature);
    if (!verified) {
      return err(socket, "this signture dosent vaild");
    }
    const dycryptedData = SessionEncryption.DycryptData(
      containt,
      findUser[0].user.SessionKey
    );
    const addMark = await MarksRepository.create(
      JSON.parse(dycryptedData),
      socket.handshake.auth.userId
    );
    socket.emit("done", null);
  }
}

module.exports = new DoctorConroller();
