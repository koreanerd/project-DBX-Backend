const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  svgUrl: String,
  pngUrl: String,
});

const resourceVersionSchema = new mongoose.Schema({
  name: String,
  categoryId: String,
  detail: {
    version: String,
    uploadDate: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
  },
  files: [fileSchema],
});

module.exports = mongoose.model("ResourceVersion", resourceVersionSchema);
