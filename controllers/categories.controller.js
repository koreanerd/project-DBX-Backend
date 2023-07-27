const postResourceController = require("./categoriesControllers/postResource.controller");
const getResourceListController = require("./categoriesControllers/getResourceList.controller");
const getResourceController = require("./categoriesControllers/getResource.controller");

const postResource = postResourceController;
const getResourceList = getResourceListController;
const getResource = getResourceController;

module.exports = {
  postResource: postResource,
  getResourceList: getResourceList,
  getResource: getResource,
};
