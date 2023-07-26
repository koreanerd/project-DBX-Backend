const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  categoryId: String,
  currentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ResourceVersion",
  },
  versions: [
    {
      version: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResourceVersion",
      },
    },
  ],
});

module.exports = mongoose.model("Resource", resourceSchema);
