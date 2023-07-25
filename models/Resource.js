const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  categoryId: String,
  currentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "resourceVersion",
  },
  versions: [
    {
      version: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resourceVersion",
      },
    },
  ],
});

module.exports = mongoose.model("Resource", resourceSchema);
