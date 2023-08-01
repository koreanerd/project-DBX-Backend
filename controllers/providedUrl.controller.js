const Resource = require("../models/Resource");

const providedUrlController = async function (req, res, next) {
  const resourceId = req.params.resourceId;

  try {
    const resource = await Resource.findOne({ _id: resourceId }).populate(
      "currentVersion"
    );

    const { svgUrl } = resource.currentVersion.files.find(file => {
      if (file.fileName === "default") {
        return file.pngUrl;
      }
    });

    res.redirect(svgUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = providedUrlController;
