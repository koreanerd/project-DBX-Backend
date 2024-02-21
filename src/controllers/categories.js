const axios = require("axios");
const Category = require("../models/Category");
const Resource = require("../models/Resource");
const ResourceVersion = require("../models/ResourceVersion");
const { uploadS3bucket } = require("../utils/s3");

const getResourceList = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid category ID." });
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: "Error", message: "Category not found." });
    }

    const resources = category.resources;

    const findCurrentVersion = resources.map(async (resource) => {
      return Resource.findOne({ _id: resource._id }).populate("currentVersion");
    });

    const resourceList = await Promise.all(findCurrentVersion);

    const responseData = resourceList.flatMap((resource) => {
      if (!resource) return [];

      const defaultFile = resource.currentVersion.files.find(
        (file) => file.option === "default",
      );

      return [
        {
          resourceId: resource._id,
          svgUrl: defaultFile.svgUrl,
        },
      ];
    });

    res.status(200).json({ resourceList: responseData });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const getResourceInfo = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the category ID.",
    });
  }

  const resourceId = req.params.resourceId;

  if (!resourceId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the resource ID.",
    });
  }

  try {
    const resourceDetail = await Resource.findOne({ _id: resourceId })
      .populate("currentVersion")
      .populate("categoryId");

    if (!resourceDetail) {
      return res
        .status(404)
        .json({ status: "Error", message: "Resource information not found." });
    }

    const { version, uploadDate, author } =
      await resourceDetail.currentVersion.details.populate("author");

    const files = resourceDetail.currentVersion.files;
    const authorName = author.name;
    const response = {
      resourceId,
      categoryId,
      categoryName: resourceDetail.categoryId.name,
      authorName,
      resourceName: resourceDetail.name,
      uploadDate,
      version,
      files,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const deleteResource = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid category ID." });
  }

  const resourceId = req.params.resourceId;

  if (!resourceId) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid resource ID." });
  }

  try {
    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json("The category cannot be found.");
    }

    if (category.resources.length === 1) {
      return res.status(400).json({
        status: "Error",
        message: "At least one resource must exist.",
      });
    }

    category.resources = category.resources.filter(
      (resource) => resource._id.toString() !== resourceId,
    );

    await category.save();

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json("The document cannot be found.");
    }

    const deleteResourceVersion = resource.versions.map((version) => {
      return ResourceVersion.findByIdAndDelete({ _id: version._id });
    });

    await Promise.all(deleteResourceVersion);

    await Resource.findByIdAndDelete({ _id: resourceId });

    res.status(200).json({
      status: "Success",
      message: "Document has been successfully deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const downloadResourceFile = async (req, res) => {
  const fileUrl = req.query.url;

  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    const fileName = fileUrl.split("/").pop();

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const buffer = Buffer.from(response.data, "binary");

    res.send(buffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Error downloading the file.",
    });
  }
};

const getResourceVersionList = async (req, res) => {
  const resourceId = req.params.resourceId;

  if (!resourceId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the resource ID.",
    });
  }

  try {
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        status: "Error",
        message: "Resource not found.",
      });
    }

    const promises = resource.versions.map((version) => {
      return ResourceVersion.findById(version._id);
    });

    const versionList = await Promise.all(promises);

    res.status(200).json(versionList);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const updateResourceVersion = async (req, res) => {
  const resourceId = req.params.resourceId;

  if (!resourceId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the resource ID.",
    });
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

  try {
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        status: "Error",
        message: "Resource not found.",
      });
    }

    const verifyVersionName = await ResourceVersion.findOne({
      name: resource.name,
      "details.version": data.details.version,
    });

    if (verifyVersionName) {
      return res.status(409).json({
        status: "Error",
        message: `The same version '${data.details.version}' already exists. Please write a higher version.`,
      });
    }

    const createResourceVersion = new ResourceVersion({
      name: resource.name,
      categoryId: resource.categoryId,
      details: {
        version: data.details.version,
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

    resource.versions.push(createResourceVersion._id);
    resource.currentVersion = createResourceVersion._id;
    await resource.save();

    const newVersionId = createResourceVersion._id.toString();

    const fileUploadPromises = await uploadS3bucket(
      createResourceVersion,
      newVersionId,
      data,
    );

    await createResourceVersion.save();
    await Promise.all(fileUploadPromises);

    res.status(200).json({
      status: "Success",
      message: "Vesion update has been completed correctly.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

const addResource = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return res.status(400).json({
      status: "Error",
      message: "The request must include the category ID.",
    });
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

  try {
    const verifyResourceName = await Resource.findOne({
      name: data.name,
    });

    if (verifyResourceName) {
      return res.status(409).json({
        status: "Error",
        message: `A same name '${data.name}' already exists. Please write a other name.`,
      });
    }

    const createResourceVersion = new ResourceVersion({
      name: data.name,
      categoryId: categoryId,
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
      categoryId: categoryId,
      currentVersion: createResourceVersion._id,
    });

    createResource.versions.push(createResourceVersion._id);
    await createResource.save();

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: "Error", message: "Category not found." });
    }

    category.resources.push(createResource._id);
    await category.save();

    res.status(200).json({
      status: "Success",
      message: "The new resource has been registered successfully.",
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
  getResourceList,
  getResourceInfo,
  deleteResource,
  downloadResourceFile,
  getResourceVersionList,
  updateResourceVersion,
  addResource,
};
