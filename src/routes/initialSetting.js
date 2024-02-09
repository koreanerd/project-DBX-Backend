const express = require("express");
const router = express.Router();
const { initialSetting } = require("../controllers/initialSetting.controller");

router.post("/", initialSetting);
module.exports = router;
