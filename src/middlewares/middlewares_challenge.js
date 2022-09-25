import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser;
  next();
};

export const textUploader = multer({ dest: "uploads/texts/" });

export const videoUploader = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 30000000 },
});

export const urlLogger = (req, res, next) => {
  // middleware that logs the recent path
  const { path } = req;
  console.log(`Path: ${path}`);
  return next();
};

export const timeLogger = (req, res, next) => {
  // middleware that logs the date of when the route happens
  const date = new Date(Date.now());
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  console.log(`Time: ${y}.${m}.${d}`);
  return next();
};

export const securityLogger = (req, res, next) => {
  // middleware that defines if the environment uses the https protocol or not
  const { protocol } = req;
  const security = protocol === "https" ? "Secure" : "Insecure";
  console.log(security);
  return next();
};

export const protectorMiddleware = (req, res, next) => {
  // middleware that redirect users if they try to reach "/protected" path
  const { path } = req;
  return path === "/protected" ? res.redirect("/") : next();
};
