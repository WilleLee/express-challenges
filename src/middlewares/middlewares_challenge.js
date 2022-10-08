import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Params = {
  id: process.env.S3_ID,
  secret: process.env.S3_SECRET,
  region: "ap-northeast-2",
  bucketName: "expresstube",
};
const s3 = new S3Client({
  credentials: { accessKeyId: s3Params.id, secretAccessKey: s3Params.secret },
  region: s3Params.region,
});
const s3Uploader = multerS3({
  s3,
  bucket: s3Params.bucketName,
  acl: "public-read",
});

export const textUploader = multer({ dest: "uploads/texts/" });

export const videoUploader = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 30000000 },
  storage: s3Uploader,
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  next();
};
export const ownMembersOnly = (req, res, next) => {
  if (req.session.loggedInUser.naver) {
    return res.redirect("/");
  }
  return next();
};

export const publicOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  return next();
};

export const loggedInUserOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  return next();
};
