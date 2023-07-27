const express = require("express");
const router = express.Router();
const {
  resource,
  getResourceList,
  getResource,
} = require("../controllers/categories.controller");

router.get("/:categoryId", getResourceList);
router.post("/:categoryId/resource", resource);
router.get("/:categoryId/resources/:resourceId", getResource);

module.exports = router;
