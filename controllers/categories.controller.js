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

const resourceList = async function (req, res, next) {
  const categoryId = req.params.categoryId;

  try {
    const categoryList = await Category.findOne({ _id: categoryId });
    const categoryResourceList = categoryList.resources;

    const findResourceList = categoryResourceList.map(resource => {
      return Resource.findOne({ _id: resource._id });
    });
    const resourceList = await Promise.all(findResourceList);

    const findResourceVersionList = resourceList.map(resource => {
      const currentVersion = resource.currentVersion;

      return ResourceVersion.findOne({ _id: currentVersion });
    });
    const resourceVersionList = await Promise.all(findResourceVersionList);

    const responseList = resourceVersionList.map(resourceVersion => {
      const id = resourceVersion._id;
      let defaultSVGUrl;
      const files = resourceVersion.files;

      for (const file of files) {
        if (file.fileName === "default") {
          defaultSVGUrl = file.svgUrl;

          break;
        }
      }

      return { id: id, svgUrl: defaultSVGUrl };
    });

    res.statusCode = 200;
    res.json({ categoryList: responseList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  resource: resource,
  resourceList: resourceList,
};
