const mongoose = require("mongoose");

const resourceVersionSchema = new mongoose.Schema({
  name: String,
  categoryId: String,
  detail: {
    version: String,
    uploadDate: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
