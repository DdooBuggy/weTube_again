import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

//-----------------------------------------------------------------//
//          user or public blocker
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

//-----------------------------------------------------------------//
//          file uploader

// aws variables
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "buggy-wetube-practice/images",
  acl: "public-read",
});
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "buggy-wetube-practice/videos",
  acl: "public-read",
});
const isHeroku = process.env.NODE_ENV === "production";

// file size object
const fileSizeObj = {
  imgSize: 5000000,
  videoSize: 10000000,
};
// functions and middlewares
const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: fileSizeObj.imgSize },
  storage: isHeroku ? s3ImageUploader : undefined,
}).single("avatar");
export const avatarUploadMiddleware = (req, res, next) => {
  avatarUpload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      req.flash(
        "error",
        "File upload failed. Maybe you uploaded too large file."
      );
      return res.status(400).redirect("/users/edit");
    } else if (error) {
      req.flash("error", "File upload failed. Unexpected error happen.");
      return res.status(400).redirect("/users/edit");
    }
    next();
  });
};
const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: fileSizeObj.videoSize },
  storage: isHeroku ? s3VideoUploader : undefined,
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
export const videoUploadMiddleware = (req, res, next) => {
  videoUpload(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      req.flash(
        "error",
        "File upload failed. Maybe you uploaded too large file."
      );
      return res.status(400).redirect("/videos/upload");
    } else if (error) {
      req.flash("error", "File upload failed. Unexpected error happen.");
      return res.status(400).redirect("/videos/upload");
    }
    next();
  });
};

//-----------------------------------------------------------------//
//          not found error
export const notFoundMiddleware = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
};

//-----------------------------------------------------------------//
//          locals variables
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "WeTube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  res.locals.imgSize = fileSizeObj.imgSize / 1000000;
  res.locals.videoSize = fileSizeObj.videoSize / 1000000;
  next();
};
