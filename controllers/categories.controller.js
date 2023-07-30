const postResourceController = require("./categoriesControllers/postResource.controller");
const getResourceListController = require("./categoriesControllers/getResourceList.controller");
const getResourceController = require("./categoriesControllers/getResource.controller");
const postResourceVersionController = require("./categoriesControllers/postResourceVersion.controller");
const getResourceVersionController = require("./categoriesControllers/getResourceVersions.controller");

const resource = postResourceController;
const categoryList = getResourceListController;
const resourceDetail = getResourceController;
const version = postResourceVersionController;
const resourceVersions = getResourceVersionController;

module.exports = {
  categoryList,
  resource,
  resourceDetail,
  version,
  resourceVersions,
};
