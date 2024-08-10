const ProjectDiscription = require("../models/projectDiscriptionModel");
const ObjectId = require("mongoose").Types.ObjectId;

class ProjectDiscriptionRepository {
  async create({ from, containt }) {
    return await ProjectDiscription.create({
      from,
      containt,
    });
  }

  async get(from) {
    return await ProjectDiscription.find({ from: from })
      .populate("from");  }




}

module.exports = new ProjectDiscriptionRepository();
