const Resource = require("../../models/Resource");
const ResourceVersion = require("../../models/ResourceVersion");

const resourceVersions = async function (req, res, next) {
  const resourceId = req.params.resourceId;
  try {
    const resource = await Resource.findOne({ _id: resourceId });

    const promiseResourceVersions = resource.versions.map(version => {
      return ResourceVersion.findOne({ _id: version._id });
    });
    const versionList = await Promise.all(promiseResourceVersions);

    res.statusCode = 200;
    res.json(versionList);
  } catch (error) {
    next(error);
  }
};

module.exports = resourceVersions;
