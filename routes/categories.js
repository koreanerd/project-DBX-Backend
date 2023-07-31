const express = require("express");
const router = express.Router();
const {
  categoryList,
  newResource,
  resource,
  newResourceVersion,
  resourceVersions,
} = require("../controllers/categories.controller");

router.get("/:categoryId", categoryList);
router.post("/:categoryId/resource", newResource);
router.get("/:categoryId/resources/:resourceId", resource);
router.post("/:categoryId/resources/:resourceId/version", newResourceVersion);
router.get("/:categoryId/resources/:resourceId/versions", resourceVersions);

module.exports = router;
