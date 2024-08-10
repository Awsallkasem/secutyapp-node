const shared = require("../shared/index");
const Symmetric = require("../utils/encryption/symmetricCrypt");
const SessionEncryption = require("../utils/encryption/level3");
const UserRepository = require("../repositories/UserRepository");
const projectDiscriptionRepositort = require("../repositories/projectDiscriptionRepositort");
class CompleteInfoController {
  async completeInfo(data, socket) {
    try {
      const { encrebtedPoneNumber, encrebtedLocation } = data.containt;
      if (!(await Symmetric.checkMac(data, socket))) {
        return;
      }
      const dycryptedPhone = await Symmetric.DycryptData(
        encrebtedPoneNumber,
        socket
      );
      const dycryptedLocation = await Symmetric.DycryptData(
        encrebtedLocation,
        socket
      );

      const user = await UserRepository.getUser(socket);
      if (!user) {
        socket.emit("err", "userNotFound");
      }
      user.phoneNumber = dycryptedPhone;
      user.location = dycryptedLocation;
      const containt = {
        encrebtedPoneNumber,
        encrebtedLocation,
      };
      const mac = await Symmetric.generateMac(JSON.stringify(containt), socket);
      await user.save();
      socket.emit("done", { containt, mac });
    } catch (e) {
      console.log(e);
      socket.emit("err", `there are probleme during reciveInfo message : ${e}`);
    }
  }

  async reciveDiscription(data, socket) {
    try {
      const { containt, from } = data;

      const users = shared.users;

      const fromUser = users.filter((user) => user.user.id == from);
      if (!(await SessionEncryption.SymettricAlgrothim(data, socket))) return;
      const dycryptedDiscription = SessionEncryption.DycryptData(
        containt,
        fromUser[0].user.SessionKey
      );

      const saveDiscription = await projectDiscriptionRepositort.create({
        from,
        containt: dycryptedDiscription,
      });
      const encryptData = SessionEncryption.EncryptData(
        "done",
        fromUser[0].user.SessionKey
      );

      const mac = SessionEncryption.generateMac(encryptData);
      socket.emit("done", { containt: encryptData, mac });
    } catch (e) {
      console.log(e);
      socket.emit("err", `there are probleme during reciveInfo message : ${e}`);
    }
  }
}

module.exports = new CompleteInfoController();
