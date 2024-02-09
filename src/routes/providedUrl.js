const express = require("express");
const router = express.Router();
const providedUrl = require("../controllers/providedUrl.controller");

router.get("/categories/:categoryId/resources/:resourceId", providedUrl);

module.exports = router;
