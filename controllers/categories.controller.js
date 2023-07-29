const postResourceController = require("./categoriesControllers/postResource.controller");
const getResourceListController = require("./categoriesControllers/getResourceList.controller");
const getResourceController = require("./categoriesControllers/getResource.controller");
const postResourceVersionController = require("./categoriesControllers/postResourceVersion.controller");

const resource = postResourceController;
const categoryList = getResourceListController;
const resourceDetail = getResourceController;
const version = postResourceVersionController;

module.exports = {
  categoryList,
  resource,
  resourceDetail,
  version,
};
