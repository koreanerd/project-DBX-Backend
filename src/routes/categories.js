const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  getResourceList,
  getResourceInfo,
  deleteResource,
  downloadResourceFile,
  getResourceVersionList,
  updateResourceVersion,
  addResource,
} = require("../controllers/categories");

router.route("/:categoryId/resource-list").get(verifyToken, getResourceList);

router
  .route("/:categoryId/resources/:resourceId")
  .get(verifyToken, getResourceInfo)
  .delete(verifyToken, deleteResource);

router.route("/:categoryId/resources").post(verifyToken, addResource);

router
  .route("/:categoryId/resources/:resourceId/versions")
  .get(verifyToken, getResourceVersionList);

router
  .route("/resources/:resourceId/versions")
  .post(verifyToken, updateResourceVersion);

router
  .route("/resources/versions/files/download")
  .get(verifyToken, downloadResourceFile);

module.exports = router;
