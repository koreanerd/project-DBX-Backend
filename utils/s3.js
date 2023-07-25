/* eslint-disable no-undef */
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const region = "ap-northeast-2";
const access_key = process.env.S3_ACCESS_KEY_ID;
const secret_key = process.env.S3_SECRET_ACCESS_KEY;
const bucket_name = "team-dbx";

const S3 = new S3Client({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

async function uploadObject(keyName, fileData, contentType) {
  const upLoadParams = {
    Bucket: bucket_name,
    Key: keyName,
    Body: fileData,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    await S3.send(new PutObjectCommand(upLoadParams));
  } catch (err) {
    next(err);
  }
}

async function downloadResource(keyName) {
  try {
    const params = {
      Bucket: bucket_name,
      Key: keyName,
    };

    const data = await S3.send(new GetObjectCommand(params));

    return data;
  } catch (err) {
    next(err);
  }
}

async function convertImage(fileData) {
  const convertedImage = await sharp(fileData).png().toBuffer();

  return convertedImage;
}

module.exports = {
  uploadObject: uploadObject,
  downloadResource: downloadResource,
  convertImage: convertImage,
  listOfBuckets: listOfBuckets,
};
