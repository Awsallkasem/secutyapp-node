const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isDocotor: {
    type: Boolean,
  },
  nationalID: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[0-9]{11}$/.test(value); // Validates that the nationalID is a string of exactly 15 digits
      },
      message: (props) =>
        `${props.value} is not a valid nationalID. It must be a string of 15 digits.`,
    },
  },
  phoneNumber: {
    type: String,
  },
  location: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
