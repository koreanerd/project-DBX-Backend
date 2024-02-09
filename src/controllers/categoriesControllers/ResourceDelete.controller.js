const Resource = require("../../models/Resource");
const ResourceVersions = require("../../models/ResourceVersion");
const Category = require("../../models/Category");

const resourceDeleteController = async function (req, res, next) {
  const resourceId = req.params.resourceId;
  const categoryId = req.params.categoryId;

  try {
    const currentCategoryResource = await Category.findOne({ _id: categoryId });
    currentCategoryResource.resources = currentCategoryResource.resources.map(
      (el) => {
        if (el !== resourceId) {
          return el;
        }
      },
    );
    await currentCategoryResource.save();

    const resource = await Resource.findOne({ _id: resourceId });
    const deleteResourceVersions = resource.versions.map((el) => {
      return ResourceVersions.findByIdAndDelete({ _id: el._id });
    });
    await Promise.all(deleteResourceVersions);
    await Resource.findByIdAndDelete({ _id: resourceId });

    res.json({
      result: "Ok",
    });
  } catch (error) {
    error.name = "MongooseError";
    error.message = "Something went wrong while deleting Resource";
    res.json({
      result: error.name,
      message: error.message,
    });

    next(error);
  }
};

module.exports = resourceDeleteController;
