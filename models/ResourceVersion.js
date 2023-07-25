const mongoose = require("mongoose");

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
  files: [
    {
      file: {
        fileName: String,
        svgUrl: String,
        pngUrl: String,
      },
    },
  ],
});

module.exports = mongoose.model("ResourceVersion", resourceVersionSchema);
