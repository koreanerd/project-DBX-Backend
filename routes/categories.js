const express = require("express");
const router = express.Router();
const {
  resource,
  resourceList,
} = require("../controllers/categories.controller");

router.post("/:categoryId/resource", resource);
router.get("/:categoryId", resourceList);

module.exports = router;
