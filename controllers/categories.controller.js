const NewResourceController = require("./categoriesControllers/NewResource.controller");
const ResourceListController = require("./categoriesControllers/CategoryResourceList.controller");
const ResourceController = require("./categoriesControllers/Resource.controller");
const NewResourceVersionController = require("./categoriesControllers/NewResourceVersion.controller");
const ResourceVersionController = require("./categoriesControllers/ResourceVersions.controller");

const newResource = NewResourceController;
const categoryList = ResourceListController;
const resource = ResourceController;
const newResourceVersion = NewResourceVersionController;
const resourceVersions = ResourceVersionController;

module.exports = {
  categoryList,
  newResource,
  resource,
  newResourceVersion,
  resourceVersions,
};
