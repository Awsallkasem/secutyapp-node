const User = require("../models/UserModel");
const ObjectId = require("mongoose").Types.ObjectId;

class UserRepository {
  async create({ email, username, hashedPasswored, nationalID, isDocotor }) {

    await User.create({
      email: email,
      username: username,
      nationalID: nationalID,
      password: hashedPasswored,
      isDocotor: isDocotor,
    });
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select({
      email: 1,
      username: 1,
      password: 1,
      nationalID: 1,
      isDoctor: 1,
      phoneNumber: 1,
      location: 1,
    });
  }

  async getUsersWhereNot(userId) {
    return await User.find({ _id: { $ne: ObjectId(userId) } });
  }
  async getStudants() {
    return await User.find({ isDocotor: { $ne: true } });
  }
  async getUserByName(myId, name) {
    return await User.find({
      _id: { $ne: ObjectId(myId), name },
    });
  }

  async getUser(socket) {
    return await User.findOne({ _id: socket.handshake.auth.userId });
  }
}

module.exports = new UserRepository();
