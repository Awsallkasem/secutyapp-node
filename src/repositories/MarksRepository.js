const MarkModel = require("../models/Mark.model");
const _ = require("lodash");
const UserModel = require("../models/UserModel");
const ObjectId = require("mongoose").Types.ObjectId;

class MarkRepository {
  async create(marks, doctorId) {
    if (marks) {
      const keys = Object.keys(marks);
      keys.map(async (nationalID) => {
        const student = await MarkModel.findOneAndUpdate(
          { nationalID: nationalID, doctorId: doctorId },
          {
            nationalID: nationalID,
            doctorId: doctorId,
            Mark: _.get(marks, nationalID),
          },
          { upsert: true, new: true },
          (err, result) => {
            if (err) {
              console.error("Error updating document:", err);
            } else {
              console.log("Document updated successfully:", result);
            }
          }
        );
      });
    }
  }
}

module.exports = new MarkRepository();
