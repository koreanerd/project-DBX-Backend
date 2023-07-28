const express = require("express");
const router = express.Router();
const initializeApp = require("../controllers/initialSetting.controller");

router.post("/", initializeApp);
module.exports = router;
