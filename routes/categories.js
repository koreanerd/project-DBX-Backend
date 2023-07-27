const express = require("express");
const router = express.Router();
const {
  postResource,
  getResourceList,
  getResource,
} = require("../controllers/categories.controller");

router.get("/:categoryId", getResourceList);
router.post("/:categoryId/resource", postResource);
router.get("/:categoryId/resources/:resourceId", getResource);

module.exports = router;
