const Resource = require("../models/Resource");

const getFixedUrl = async function (req, res) {
  const resourceId = req.params.resourceId;

  if (!resourceId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the resource ID.",
    });
  }

  try {
    const resource = await Resource.findOne({ _id: resourceId }).populate(
      "currentVersion",
    );

    if (!resource) {
      res.status(404).json({
        status: "Error",
        message: "Resource with the provided ID not found.",
      });
    }

    const { svgUrl } = resource.currentVersion.files.find((file) => {
      if (file.option === "default") {
        return file.pngUrl;
      }
    });

    res.status(200).json(svgUrl);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

module.exports = { getFixedUrl };
