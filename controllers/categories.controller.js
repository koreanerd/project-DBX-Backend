const postResourceController = require("./categoriesController/postResource.controller");
const getResourceListController = require("../controllers/categoriesController/getResourceList.controller");
const getResourceController = require("../controllers/categoriesController/getResource.controller");

const resource = postResourceController;
const getResourceList = getResourceListController;
const getResource = getResourceController;

module.exports = {
  resource: resource,
  getResourceList: getResourceList,
  getResource: getResource,
};
