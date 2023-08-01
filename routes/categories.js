const express = require("express");
const router = express.Router();
const {
  category,
  categoryList,
  newResource,
  resource,
  newResourceVersion,
  resourceVersions,
  resourceDelete,
} = require("../controllers/categories.controller");

router.get("/", category);
router.get("/:categoryId", categoryList);
router.post("/:categoryId/resource", newResource);
router.get("/:categoryId/resources/:resourceId", resource);
router.delete("/:categoryId/resources/:resourceId", resourceDelete);
router.post("/:categoryId/resources/:resourceId/version", newResourceVersion);
router.get("/:categoryId/resources/:resourceId/versions", resourceVersions);

module.exports = router;
