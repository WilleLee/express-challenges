import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  console.log("loggedIn: " + res.locals.loggedIn);
  next();
};
export const ownMembersOnly = (req, res, next) => {
  if (req.session.loggedInUser.naver) {
    return res.redirect("/");
  }
  return next();
};

export const textUploader = multer({ dest: "uploads/texts/" });

export const videoUploader = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 30000000 },
});

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
