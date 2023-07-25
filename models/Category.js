const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
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
