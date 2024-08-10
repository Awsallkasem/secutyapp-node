const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MarkSchema = mongoose.Schema({
  doctorId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  nationalID: {
    type: String,
    required: true,
    ref: "User",
  },
  Mark: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Mark", MarkSchema);
