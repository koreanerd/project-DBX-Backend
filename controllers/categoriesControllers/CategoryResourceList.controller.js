const Resource = require("../../models/Resource");
const Category = require("../../models/Category");

const categoryResourceListController = async function (req, res, next) {
  const categoryId = req.params.categoryId;

  try {
    const categoryList = await Category.findOne({ _id: categoryId });
    const categoryResourceList = categoryList.resources;

    const findResourceList = categoryResourceList.map(async resource => {
      return Resource.findOne({ _id: resource._id }).populate("currentVersion");
    });
    const resourceList = await Promise.all(findResourceList);

    const responseData = resourceList.map(resource => {
      const id = resource._id;
      const { files } = resource.currentVersion;

      for (const { fileName, svgUrl } of files) {
        if (fileName === "default") {
          return { id, svgUrl };
        }
      }
    });

    res.statusCode = 200;
    res.json({ categoryList: responseData });
  } catch (error) {
    next(error);
  }
};

module.exports = categoryResourceListController;
