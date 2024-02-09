const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { authUser } = require("../controllers/authUser");
const { getUserInformation } = require("../controllers/user");

router.route("/auth-user").post(verifyToken, authUser);

router.route("/").get(verifyToken, getUserInformation);

module.exports = router;
