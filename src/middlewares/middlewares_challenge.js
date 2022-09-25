import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  next();
};

export const textUploader = multer({ dest: "uploads/texts/" });

export const videoUploader = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 30000000 },
});
