require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoDB = require("./src/databases/mongodb/index");
const socketIO = require("socket.io");
const shared = require("./src/shared");
const CompleteInfoController = require("./src/controllers/completeInfoController.js");
const app = express();
const RSA = require("./src/utils/encryption/PgpCrypt");
const UserController = require("./src/controllers/UserController");
const sessionController = require("./src/controllers/sessionController");
const Server = require("socket.io");
const user = require("./src/middlewares/auths/user.js");
const forge = require("node-forge");

const crypto = require("crypto");

const err = require("./src/controllers/errorController.js");
const doctorController = require("./src/controllers/doctorController.js");
const UserRepository = require("./src/repositories/UserRepository.js");

app.use(express.json());
const corsOptions = {
  origin: "*", // Specify the allowed origin (use * to allow any)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
const server = require("http").createServer(app);
let io = socketIO(server, { cors: corsOptions });
let users = [];

shared.io = io;
shared.users = users;

io.on("connection", async (socket) => {
  socket.on(
    "new user",
    async (user) => await UserController.add_User_With_Socet(user, socket)
  );
  socket.use(async (packet, next) => {
    if (
      packet[0] === "extraInfo" ||
      packet[0] === "RequestHandshaking" ||
      packet[0] === "csr"
    ) {
      if (user(socket, next)) {
        next();
      }
    } else if (packet[0] === "getstudents") {
      if (user(socket, next)) {
        const loggedUser = await UserRepository.getUser(socket);
        if (loggedUser) {
          if (loggedUser.isDocotor) {
            {
              next();
            }
          } else {
            err(socket, { error: "unthorized" });
          }
        }
      }
    } else {
      next();
    }
  });
  socket.on("getstudents", async () => {
    doctorController.getstudents(socket);
  });
  socket.on("extraInfo", (data) => {
    CompleteInfoController.completeInfo(data, socket);
  });
  socket.on("RequestHandshaking", (data) =>
    sessionController.handshaking(data, socket)
  );
  socket.on("sign", (data) => {
    doctorController.setMarks(data, socket);
  });

  socket.on("createUser", (data) => UserController.create(data, socket));
  socket.on("login", (data) => UserController.login(data, socket));
  socket.on("disconnect", () => UserController.remove_user_from_Socet(socket));

  socket.on("addDiscription", async (data) =>
    CompleteInfoController.reciveDiscription(data, socket)
  );

  //send to me encryptedSessionKey
  socket.on("newSessionKey", (data) =>
    sessionController.checkSessionKey(data, socket)
  );
  socket.on("csr", (data) => sessionController.reciveCsr(data, socket));
});

server.listen("8081", () => {
  console.log("Listening on port 8081");

  mongoDB.connect();
  //Create CA With Keys Root
  require("./level5/in_hous_ca");

  //create csr and verify it from OurCA
  // require("./level5/index.js");
  RSA.getKeysOfServer();
  console.log(` OURCertificate :  ${process.env.ourCertificate}`);
  console.log(`PubCA : ${process.env.PubCA}`);
  console.log(`PrvCA : ${process.env.PrvCA}`);
  console.log(`CAPem : ${process.env.CAPem}`);
});
