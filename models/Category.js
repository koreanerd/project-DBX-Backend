const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  resources: [
    {
      resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
