import User from "../models/User";

export const users = (req, res) => {
  return res.render("users/users", { pageTitle: "Users" });
};

export const user = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.redirect("/");
  }
  return res.render("users/user", { pageTitle: user.username, user });
};

export const editProfile = (req, res) => {
  return res.render("users/edit-profile", {
    pageTitle: "Edit Profile",
  });
};
