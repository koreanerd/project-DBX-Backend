const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const region = process.env.AWS_REGION;

const S3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadObject = async (keyName, fileData, contentType) => {
  const upLoadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keyName,
    Body: fileData,
    ContentType: contentType,
  };

  try {
    await S3.send(new PutObjectCommand(upLoadParams));
  } catch (error) {
    throw new Error(error.message);
  }
};

const downloadResource = async (keyName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keyName,
  };

  try {
    const url = await S3.send(new GetObjectCommand(params));

    return url;
  } catch (error) {
    throw new Error(error.message);
  }
};

const convertImage = async (fileData) => {
  const convertedImage = await sharp(Buffer.from(fileData)).png().toBuffer();

  return convertedImage;
};

const generateFilePath = (id, option, fileExtension) => {
  const path = `${id}/${option}.${fileExtension}`;

  return path;
};

const uploadS3bucket = async (versionCreation, versionId, data) => {
  const fileUploadPromises = [];

  for (const [index, file] of data.files.entries()) {
    const svgPath = generateFilePath(versionId, file.option, "svg");
    const pngPath = generateFilePath(versionId, file.option, "png");

    versionCreation.files[
      index
    ].svgUrl = `${process.env.AWS_BUCKET_URL}${svgPath}`;
    versionCreation.files[
      index
    ].pngUrl = `${process.env.AWS_BUCKET_URL}${pngPath}`;

    const svgFile = file.svgContent;
    const convertToPng = await convertImage(file.svgContent);

    const svgUploadPromise = uploadObject(svgPath, svgFile, "image/svg+xml");
    const pngUploadPromise = uploadObject(pngPath, convertToPng, "image/png");

    fileUploadPromises.push(svgUploadPromise, pngUploadPromise);
  }

  return fileUploadPromises;
};

module.exports = {
  uploadObject,
  downloadResource,
  convertImage,
  uploadS3bucket,
};
