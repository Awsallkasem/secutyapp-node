const UserRepository = require("../repositories/UserRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../config/jwt");
const shared = require("../../src/shared/index");
const err = require("./errorController");
const generate_Key = require("../utils/encryption/privite_Key");
const auth = require("../middlewares/auths/user");
const Sym = require("../utils/encryption/symmetricCrypt");
const UserModel = require("../models/UserModel");

function generateJwtToken(user) {
  const { _id } = user;
  return jwt.sign(
    {
      _id,
    },
    jwtConfig.secret
  );
}

class UserController {
  async create(data, socket) {
    try {
      const { email, username, password, nationalID, isDocotor } = data;
      if (!email || !username || !password || !nationalID) {
        return err(socket, "invalid Input");
      }

      const userExists = (await UserRepository.findByEmail(email)) != null;

      const isExist=await UserModel.find({nationalID:nationalID});
      if (userExists||isExist.length!=0) {
        return err(socket, "User is Already Registered");
      }
      const hashedPasswored = await bcrypt.hash(password, 10);
      await UserRepository.create({
        email,
        username,
        hashedPasswored,
        nationalID,
        isDocotor,
      });
      const newUser = await UserRepository.findByEmail(email);
      const token = generateJwtToken(newUser);
      newUser.password = undefined;

      await this.add_User_With_Socet(newUser, socket);
      const users = shared.users;
      const findUsers = users.filter((user) => user.user.id == newUser._id);
      findUsers.forEach((user) => {
        user.socket.emit("Reg-Success", {
          user: newUser,
          token,
        });
      });
    } catch (err) {
      socket.emit("err", `error-During-SignUp: ${err}`);
    }
  }

  async login(data, socket) {
    try {
      const { email, password } = data;

      if (!email || !password) return err(socket, "invalid Input");

      const user = await UserRepository.findByEmail(email);

      if (!user) return err(socket, "This User Is not found");

      if (!(await bcrypt.compare(password, user.password)))
        return err(socket, "wrong password");

      const token = generateJwtToken(user);

      user.password = undefined;

      socket.emit("log-Success", {
        user: user,
        token,
      });
      console.log("i am login");
    } catch (err) {
      socket.emit("err", `error-During-login: ${err}`);
    }
  }


 

  add_User_With_Socet(newUser, socket) {
    if (shared.users.filter((x) => x.socket.id == socket.id).length == 0) {
      const user = {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        isDocotor:newUser.isDocotor?true:false,
        SessionKey: null,
        publicKey: null,
        certificat:null
      };

      shared.users.push({ user, socket });
      socket.emit("user-in", null);
    } 
  }

  async remove_user_from_Socet(socket) {
    shared.users = shared.users.filter((x) => x.socket.id !== socket.id);
  }
}

module.exports = new UserController();
