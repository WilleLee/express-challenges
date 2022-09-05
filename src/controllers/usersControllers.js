export const users = (req, res) => {
  return res.render("users/users", { pageTitle: "Users" });
};

export const user = (req, res) => {
  const { id } = req.params;
  return res.render("users/user", { pageTitle: `user ${id}`, userId: id });
};

export const editProfile = (req, res) => {
  return res.render("users/edit-profile", {
    pageTitle: "Edit Profile",
  });
};
