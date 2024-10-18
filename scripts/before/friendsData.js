const fs = require("fs");
const yaml = require("js-yaml");
const { resolve } = require("path");
const AWS = require("aws-sdk");

const friendsArray = [];
const friendsYaml = resolve(__dirname, "../../data/friends.yaml");
const friendsData = yaml.load(fs.readFileSync(friendsYaml, "utf8"));
const formattedData = {
  friends: friendsData,
};

formattedData.friends.map((friendItem) => {
  friendsArray.push(
    new Array(friendItem.nickname, friendItem.url, friendItem.avatar)
  );
});

const eventualData = JSON.stringify({
  friends: friendsArray,
});

// 使用Buffer对象并指定编码为UTF-8
const bufferData = Buffer.from(eventualData, 'utf8');

const s3 = new AWS.S3({
  endpoint: "https://s3.bitiful.net",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_ACCESS_KEY,
  signature_version: "v4",
  use_path_style_endpoint: false,
  use_aws_shared_config_files: false,
  region: "cn-east-1",
});

const params = {
  Bucket: "republic",
  Key: "friendsList.json",
  Body: bufferData, // 使用Buffer对象
  ContentType: "application/json; charset=utf-8", // 指定Content-Type和编码
  ContentEncoding: "utf-8" // 指定Content-Encoding
};

s3.upload(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Upload Success", data.Location);
  }
});
