const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { getFixedUrl } = require("../controllers/dbxServices");

router.route("/categories/resources/:resourceId").get(verifyToken, getFixedUrl);

module.exports = router;
