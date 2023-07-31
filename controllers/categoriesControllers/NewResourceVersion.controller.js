const Resource = require("../../models/Resource");
const ResourceVersion = require("../../models/ResourceVersion");
const User = require("../../models/User");
const { convertImage, uploadObject } = require("../../utils/s3");

const newResourceVersion = async function (req, res, next) {
  const resourceId = req.params.resourceId;
  const data = req.body;

  try {
    const resource = await Resource.findOne({ _id: resourceId });
    const user = await User.findOne({ email: data.detail.email });
    const IsResourceVersionExist = await ResourceVersion.findOne({
      name: data.name,
      "detail.version": data.detail.version,
    });

    if (IsResourceVersionExist) {
      throw new Error("ResourceVersions Exists");
    }

    const newResourceVersion = await new ResourceVersion({
      categoryId: data.categoryId,
      name: data.name,
      detail: {
        version: data.detail.version,
        uploadDate: data.detail.uploadDate,
        author: user._id,
        description: data.detail.description,
      },
      files: data.files.map(el => {
        return {
          fileName: el.fileName,
        };
      }),
    }).save();

    resource?.versions.push(newResourceVersion._id);
    resource.currentVersion = newResourceVersion._id;
    await resource.save();

    const newResourceVersionObjectId = JSON.stringify(newResourceVersion._id);

    try {
      const uploadPromises = data.files.map(async (el, index) => {
        const uploadNameSVG =
          newResourceVersionObjectId + "/" + el.fileName + ".svg";
        const uploadNamePNG =
          newResourceVersionObjectId + "/" + el.fileName + ".png";

        newResourceVersion.files[index].svgUrl =
          "https://team-dbx.s3.ap-northeast-2.amazonaws.com/" + uploadNameSVG;
        newResourceVersion.files[index].pngUrl =
          "https://team-dbx.s3.ap-northeast-2.amazonaws.com/" + uploadNamePNG;

        const convertedPNG = await convertImage(el.svgFile);
        return (
          uploadObject(uploadNameSVG, el.svgFile, "image/svg+xml"),
          uploadObject(uploadNamePNG, convertedPNG, "image/png")
        );
      });

      await newResourceVersion.save();
      await Promise.all(uploadPromises);

      res.statusCode = 201;
      res.json({ result: "Ok" });
    } catch (error) {
      throw new Error("s3 Error");
    }
  } catch (error) {
    if (error.message === "s3 Error") {
      res.statusCode = 500;
      res.json({
        result: "error",
        message: "500 s3 Error",
      });

      return;
    }

    if (error.message === "ResourceVersions Exists") {
      res.statusCode = 409;
      res.json({
        result: "error",
        message: "409 ResourceVersions Exists",
      });

      return;
    }

    next(error);
  }
};

module.exports = newResourceVersion;
