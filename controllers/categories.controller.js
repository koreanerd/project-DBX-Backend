/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { uploadObject, convertImage } = require("../utils/s3");
const ResourceVersion = require("../models/ResourceVersion");
const Resource = require("../models/Resource");
const User = require("../models/User");
const Category = require("../models/Category");

const resource = async function (req, res, next) {
  const data = req.body;

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
      categoryId: data.categoryId,
      detail: {
        version: "1.0.0",
        uploadDate: data.detail.uploadDate,
        author: user._id,
      },
      files: data.files.map(el => {
        return {
          file: {
            fileName: el.file.fileName,
          },
        };
      }),
    }).save();

    const newResourceVersionObjectId = JSON.stringify(newResourceVersion._id);

    const uploadPromises = data.files.map(async (el, index) => {
      const uploadNameSVG =
        newResourceVersionObjectId + "/" + el.file.fileName + ".svg";
      const uploadNamePNG =
        newResourceVersionObjectId + "/" + el.file.fileName + ".png";
      newResourceVersion.files[index].file.svgUrl =
        "https://team-dbx.s3.ap-northeast-2.amazonaws.com/" + uploadNameSVG;
      newResourceVersion.files[index].file.pngUrl =
        "https://team-dbx.s3.ap-northeast-2.amazonaws.com/" + uploadNamePNG;

      const convertedPNG = await convertImage(el.file.svgFile);

      return (
        uploadObject(uploadNameSVG, el.file.svgFile, "image/svg+xml"),
        uploadObject(uploadNamePNG, convertedPNG, "image/png")
      );
    });

    newResourceVersion.save();

    await Promise.all(uploadPromises);

    const newResource = await new Resource({
      name: data.name,
      categoryId: data.categoryId,
      currentVersion: newResourceVersion._id,
    }).save();

    newResource.versions.push(newResourceVersion._id);
    newResource.save();

    const category = await Category.findOne({ _id: data.categoryId });
    category.resources.push(newResource._id);
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

    next(error);
  }
};

module.exports = {
  resource: resource,
};
