const Resource = require("../../models/Resource");

const resourceController = async function (req, res, next) {
  const resourceId = req.params.resourceId;

  try {
    const resourceDetail = await Resource.findOne({ _id: resourceId })
      .populate("currentVersion")
      .populate("categoryId");
    const { version, uploadDate, author } =
      await resourceDetail.currentVersion.detail.populate("author");

    const files = resourceDetail.currentVersion.files;
    const authorName = author.name;
    const response = {
      categoryName: resourceDetail.categoryId.name,
      authorName,
      resourceName: resourceDetail.name,
      uploadDate,
      version,
      files,
    };

    res.statusCode = 200;
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = resourceController;
