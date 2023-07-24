/* eslint-disable no-undef */
const {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
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

async function listOfBuckets() {
  try {
    const response = await S3.send(new ListBucketsCommand({}));
    const buckets = response.Buckets;

    for (let bucket of buckets) {
      console.log(bucket);
    }
  } catch (error) {
    console.log("Bucket 오류");
  }
}

async function uploadObject(keyName, fileData, contentType) {
  const upLoadParams = {
    Bucket: bucket_name,
    Key: keyName, // 업로드할 파일명
    Body: fileData, // 파일 데이터
    ContentType: contentType,
    ACL: "public-read", //public으로 보여줄지 말지에 대한 부분
  };

  try {
    const responseS3 = await S3.send(new PutObjectCommand(upLoadParams));
    console.log(responseS3);
  } catch (err) {
    next(err);
  }
}

async function downloadResource(keyName) {
  console.log("작동오케이??");
  try {
    const params = {
      Bucket: bucket_name,
      Key: keyName,
    };

    const data = await S3.send(new GetObjectCommand(params));
    console.log("SVG 파일 다운로드 완료!", data);
  } catch (err) {
    console.error("파일 다운로드 오류:", err);
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
