const express = require("express");
const router = express.Router();
const {
  categoryList,
  resource,
  resourceDetail,
  version,
  resourceVersions,
} = require("../controllers/categories.controller");

router.get("/:categoryId", categoryList);
router.post("/:categoryId/resource", resource);
router.get("/:categoryId/resources/:resourceId", resourceDetail);
router.post("/:categoryId/resources/:resourceId/version", version);
router.get("/:categoryId/resources/:resourceId/versions", resourceVersions);

module.exports = router;
