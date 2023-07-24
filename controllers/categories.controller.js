/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { uploadObject } = require("../utils/s3");
const ResourceVersion = require("../models/ResourceVersion");
// const Resource = require("../models/Resource");
const User = require("../models/User");

const resource = async function (req, res, next) {
  const data = req.body;
  const user = await User.findOne({ email: data.detail.email });
  console.log(user);
  // uploadObject(req.body.name, req.body.files[0].file.svgFile, "image/svg+xml");
  const resourceVersion = await ResourceVersion.findOne({
    name: data.name,
    detail: { version: "1.0.0" },
  });
  console.log(resourceVersion);
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

  data.files.forEach((el, index) => {
    const uploadName =
      newResourceVersionObjectId + "/" + el.file.fileName + ".svg";
    console.log("uploadName", uploadName);
    uploadObject(uploadName, el.file.svgFile, "image/svg+xml");
    newResourceVersion.files[index].file.svgUrl =
      "https://team-dbx.s3.ap-northeast-2.amazonaws.com/%" + uploadName;
  });

  await newResourceVersion.save();
  // try {
  // } catch (error) {}
};

module.exports = {
  resource: resource,
};
