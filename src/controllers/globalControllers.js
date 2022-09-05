export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const trending = (req, res) => {
  return res.render("trending", { pageTitle: "Trending" });
};

export const news = (req, res) => {
  return res.render("news", { pageTitle: "New Stuffs" });
};

export const join = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const login = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
