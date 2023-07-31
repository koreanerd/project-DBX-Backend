const NewResourceController = require("./categoriesControllers/NewResource.controller");
const ResourceListController = require("./categoriesControllers/CategoryResourceList.controller");
const ResourceController = require("./categoriesControllers/Resource.controller");
const NewResourceVersionController = require("./categoriesControllers/NewResourceVersion.controller");
const ResourceVersionController = require("./categoriesControllers/ResourceVersions.controller");
const CategoryController = require("./categoriesControllers/Category.controller");

const newResource = NewResourceController;
const categoryList = ResourceListController;
const resource = ResourceController;
const newResourceVersion = NewResourceVersionController;
const resourceVersions = ResourceVersionController;
const category = CategoryController;

module.exports = {
  category,
  categoryList,
  newResource,
  resource,
  newResourceVersion,
  resourceVersions,
};
