const express = require("express");
const router = express.Router();
const initializeApp = require("../controllers/initialSetting.controller");

router.get("/", initializeApp);
module.exports = router;
