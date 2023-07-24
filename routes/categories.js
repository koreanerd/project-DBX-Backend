const express = require("express");
const router = express.Router();
const { resource } = require("../controllers/categories.controller");

router.post("/:categoryId/resource", resource);

module.exports = router;
