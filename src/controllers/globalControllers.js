export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const trending = (req, res) => {
  return res.send("trending");
};

export const news = (req, res) => {
  return res.send("news");
};

export const join = (req, res) => {
  return res.send("join");
};

export const login = (req, res) => {
  return res.send("login");
};
