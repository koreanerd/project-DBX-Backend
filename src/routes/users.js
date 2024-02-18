const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { authUser } = require("../controllers/authUser");
const {
  getMyInformation,
  initialRegistration,
} = require("../controllers/users");

router.route("/auth-user").post(verifyToken, authUser);

router.route("/me").get(verifyToken, getMyInformation);

router.route("/initialize").post(verifyToken, initialRegistration);

module.exports = router;
