const User = require("../models/User");
const Category = require("../models/Category");
const ResourceVersion = require("../models/ResourceVersion");
const Resource = require("../models/Resource");
const { uploadS3bucket } = require("../utils/s3");

const getMyInformation = async (req, res) => {
  const uid = req.user.uid;

  try {
    const myInfo = await User.findOne({ uid });

    if (!myInfo) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    res.status(200).json(myInfo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const initialRegistration = async (req, res) => {
  if (!req.user.isInitialUser) {
    res.status(403).json({ status: "Error", message: "Not initial user." });

    return;
  }

  const data = req.body.data;

  const isDefault = data.files.find((file) => file.option === "default");

  if (!isDefault) {
    res.status(400).json({
      status: "Error",
      message: "You must register the 'Default' image.",
    });

    return;
  }

  const categories = ["Brand Logo", "Key Image", "Icon"];

  try {
    const categoryList = await Promise.all(
      categories.map(async (categoryName) => {
        const category = await new Category({ name: categoryName }).save();

        return category;
      }),
    );

    const brandLogoCategoryId = categoryList.find(
      (category) => category.name === "Brand Logo",
    )?._id;

    const categoriesWithIds = categoryList.map((category) => ({
      name: category.name,
      id: category._id,
    }));

    await User.findByIdAndUpdate(req.user._id, {
      categoryIds: categoriesWithIds,
    });

    const createResourceVersion = new ResourceVersion({
      name: data.name,
      categoryId: brandLogoCategoryId,
      details: {
        version: "1.0.0",
        uploadDate: data.details.uploadDate,
        author: req.user._id,
        description: data.details.description,
      },
      files: data.files.map((file) => {
        return {
          option: file.option,
          svgContent: file.svgContent,
        };
      }),
    });

    const versionId = createResourceVersion._id.toString();

    const fileUploadPromises = await uploadS3bucket(
      createResourceVersion,
      versionId,
      data,
    );

    await createResourceVersion.save();
    await Promise.all(fileUploadPromises);

    const createResource = new Resource({
      name: data.name,
      categoryId: brandLogoCategoryId,
      currentVersion: createResourceVersion._id,
    });

    createResource.versions.push(createResourceVersion._id);
    await createResource.save();

    const category = await Category.findById(brandLogoCategoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: "Error", message: "Category not found." });
    }

    category.resources.push(createResource._id);
    await category.save();

    await User.findByIdAndUpdate(req.user._id, {
      isInitialUser: false,
    });

    res.status(200).json({
      status: "Success",
      message: "Initial setup has been completed correctly.",
      categoryIds: categoriesWithIds,
      name: req.user.name,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

module.exports = {
  getMyInformation,
  initialRegistration,
};
