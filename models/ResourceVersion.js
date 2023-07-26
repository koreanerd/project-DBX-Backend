const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  svgUrl: String,
  pngUrl: String,
});

const resourceVersionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  categoryId: String,
  detail: {
    version: String,
    uploadDate: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  files: [fileSchema],
});

module.exports = mongoose.model("ResourceVersion", resourceVersionSchema);
