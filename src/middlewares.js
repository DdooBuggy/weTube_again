import multer from "multer";

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
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 5000000 },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
});

export const notFoundMiddleware = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
};