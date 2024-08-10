// crypto module
const crypto = require("crypto");
const { getUser } = require("../../repositories/UserRepository");

// generate 16 bytes of random data
// generate 16 bytes of random data
const initVector = "1234567812345678"; /*crypto.randomBytes(16)*/
const algorithm = "aes-256-cbc"; // You may choose the appropriate algorithm
// /AuthService.getCurrentUser().nationalID/* crypto.createHash('md5').update(secret).digest('hex');*/// 16 Bytes and IV is 16 Bytes

class Sym_Alg {
  async EncryptData(message, socket) {
    const Securitykey = await getUser(socket);
    const keyBuffer = Buffer.from(Securitykey.nationalID, "utf8");
    const key = crypto
      .createHash("sha256")
      .update(keyBuffer)
      .digest("base64")
      .substr(0, 32);

    const encryptalgo = crypto.createCipheriv(algorithm, key, initVector);
    console.log(`sec is : ${key} iv : ${initVector.toString("hex")}`);
    let encrypted = encryptalgo.update(message, "utf8", "hex");
    encrypted += encryptalgo.final("hex");
    console.log(`encrept  : ${encrypted}`);
    return encrypted;
  }

  async DycryptData(message, socket) {
    const Securitykey = await getUser(socket);
    const keyBuffer = Buffer.from(Securitykey.nationalID, "utf8");
    const key = crypto
      .createHash("sha256")
      .update(keyBuffer)
      .digest("base64")
      .substr(0, 32);
    console.log(`sec from Dy ${Securitykey}`);
    const decryptalgo = crypto.createDecipheriv(algorithm, key, initVector);

    let decrypted = decryptalgo.update(message, "hex", "utf8");
    decrypted += decryptalgo.final("utf8");
    return decrypted;
  }

  async generateMac(data, socket) {
    return crypto
      .createHmac("sha1", "62608e08adc29a8d6dbc9754e659f125")
      .update(`${data}`)
      .digest("hex");
  }

  async checkMac(data, socket) {
    const originalMac = data.mac;
    data.mac = undefined;
    const currentMac = await this.generateMac(
      JSON.stringify(data.containt),
      socket
    );
    if (originalMac != currentMac) {
      socket.emit("err", "Data Is Hacked");
      return false;
    }
    return true;
  }
}

module.exports = new Sym_Alg();
