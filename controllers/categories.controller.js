const postResourceController = require("./categoriesControllers/postResource.controller");
const getResourceListController = require("./categoriesControllers/getResourceList.controller");
const getResourceController = require("./categoriesControllers/getResource.controller");

const resource = postResourceController;
const categoryList = getResourceListController;
const resourceDetail = getResourceController;

module.exports = {
  categoryList,
  resource,
  resourceDetail,
};
