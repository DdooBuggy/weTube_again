import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "WeTube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const loggedInOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first");
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const multerUploader = multerS3({
  s3: s3,
  bucket: "buggy-wetube-practice",
  acl: "public-read",
});
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 5000000 },
  storage: multerUploader,
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
  storage: multerUploader,
});

export const notFoundMiddleware = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
};
