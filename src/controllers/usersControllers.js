import User from "../models/User";
import bcrypt from "bcrypt";

const $EditProfile = "Edit Profile";

export const users = (req, res) => {
  return res.render("users/users", { pageTitle: "Users" });
};

export const user = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.redirect("/");
  }
  return res.render("users/user", { pageTitle: user.username, user, id });
};

export const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (
      !user ||
      String(req.session.loggedInUser._id) !== String(id) ||
      !req.session.loggedIn
    ) {
      return res.redirect("/");
    }
    return res.render("users/edit", { pageTitle: $EditProfile, user, id });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.redirect("/");
    }
    const {
      body: { username },
      file: { location },
    } = req;
    if (!username) {
      return res.render("users/edit", {
        pageTitle: $EditProfile,
        user,
        errorMessage: "Username must exist.",
      });
    }
    const profile_image = location || user.profile_image;
    await User.findByIdAndUpdate(id, {
      username,
      profile_image,
    });
    return res.redirect(`/users/${id}`);
  } catch (err) {
    console.log(err);
    return res.redirect(`/users/${id}`);
  }
};

export const editPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (
      !user ||
      !req.session.loggedIn ||
      String(req.session.loggedInUser._id) !== String(id)
    ) {
      return res.redirect("/");
    }
    return res.render("users/password", { pageTitle: $EditProfile });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};
export const postEditPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const { formerPassword, newPassword, passwordc } = req.body;
    const user = await User.findById(id);
    if (!formerPassword || !newPassword || !passwordc) {
      return res.render(`/users/${id}/edit/password`, {
        pageTitle: $EditProfile,
        errorMessage: "all conditions must be fulfilled",
      });
    }
    if (!user) {
      return res.redirect("/");
    }
    const compare = bcrypt.compare(formerPassword, user.password);
    if (!compare) {
      return res.render(`/users/${id}/edit/password`, {
        pageTitle: $EditProfile,
        errorMessage: "who are you?",
      });
    }
    if (newPassword !== passwordc) {
      return res.render(`/users/${id}/edit/password`, {
        pageTitle: $EditProfile,
        errorMessage: "password confirmation has failed",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.redirect(`/users/${id}`);
  } catch (err) {
    console.log(err);
    return res.redirect(`/users/${id}/edit/password`);
  }
};
