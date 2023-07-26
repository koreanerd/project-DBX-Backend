const express = require("express");
const router = express.Router();
const {
  resource,
  getResourceList,
} = require("../controllers/categories.controller");

router.post("/:categoryId/resource", resource);
router.get("/:categoryId", getResourceList);

module.exports = router;
