const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	isAdmin: Boolean,
});

module.exports = mongoose.model("User", userSchema);
