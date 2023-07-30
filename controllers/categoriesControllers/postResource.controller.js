const { uploadObject, convertImage } = require("../../utils/s3");
const ResourceVersion = require("../../models/ResourceVersion");
const Resource = require("../../models/Resource");
const User = require("../../models/User");
const Category = require("../../models/Category");

const postResourceController = async function (req, res, next) {
  const data = req.body;
  const categoryId = req.params.categoryId;

  try {
    const user = await User.findOne({ email: data.detail.email });
    const resourceVersion = await ResourceVersion.findOne({
      name: data.name,
    });

    if (resourceVersion) {
      throw new Error("Resource Name Exist");
    }

    const newResourceVersion = await new ResourceVersion({
      name: data.name,
      categoryId: categoryId,
      detail: {
        version: "1.0.0",
        uploadDate: data.detail.uploadDate,
        author: user._id,
      },
      files: data.files.map(el => {
        return {
          fileName: el.fileName,
        };
      }),
    }).save();

    const newResourceVersionObjectId = JSON.stringify(newResourceVersion._id);

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

    const newResource = await new Resource({
      name: data.name,
      categoryId: categoryId,
      currentVersion: newResourceVersion._id,
    }).save();

    newResource.versions.push(newResourceVersion._id);
    newResource.save();

    const category = await Category.findOne({ _id: categoryId });
    category?.resources.push(newResource._id);
    category.save();

    res.statusCode = 201;
    res.json({ result: "ok" });
  } catch (error) {
    if (error.message === "Resource Name Exist") {
      res.statusCode = 409;
      res.json({
        result: "error",
        message: "409 Resource Name Exist",
      });

      return;
    }

    if (error.message === "s3 Error") {
      res.statusCode = 500;
      res.json({
        result: "error",
        message: "500 s3 Error",
      });

      return;
    }

    next(error);
  }
};

module.exports = postResourceController;
