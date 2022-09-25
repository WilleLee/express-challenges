import Movie from "../models/Movie";
import User from "../models/User";
import bcrypt from "bcrypt";

export const home = async (req, res) => {
  const movies = await Movie.find({});
  return res.render("home", { pageTitle: "Home", movies });
};
export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload Movie" });
};
export const postUpload = async (req, res) => {
  try {
    const {
      loggedInUser: { _id },
    } = req.session;
    const {
      file: { path },
    } = req;
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year || !path) {
      return res.render("upload", {
        pageTitle: "Upload Movie",
        errorMessage: "Not Fulfilled",
      });
    }
    const movie = new Movie({
      path,
      title,
      note,
      rating,
      year,
      genres: genres ? genres.split(",").map((genre) => genre.trim()) : [],
      owner: _id,
    });
    await movie.save();
    const user = await User.findById(_id);
    user.videos.push(movie._id);
    await user.save();
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.status(400).render("upload", {
      pageTitle: "Upload Movie",
      errorMessage: "Unexpected errors happened.",
    });
  }
};

export const join = async (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  try {
    const { username, useremail, password, passwordc } = req.body;
    const existingUser = await User.exists({ useremail });
    if (existingUser) {
      return res.status(400).render("join", {
        pageTitle: "Join",
        errorMessage: "This useremail has already been taken.",
      });
    }
    if (password !== passwordc) {
      return res.status(400).render("join", {
        pageTitle: "Join",
        errorMessage: "Password confirmation failed.",
      });
    }
    await User.create({ username, useremail, password });
    return res.redirect("/login");
  } catch (err) {
    console.log(err.message);
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "unexprected errors happened",
    });
  }
};

export const login = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ useremail });
    const compare = await bcrypt.compare(password, user.password);
    if (!user || !compare) {
      return res.render("login", {
        pageTitle: "Login",
        errorMessage: "The user doesn't exist or the password is incorrect.",
      });
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = user;
    return res.redirect("/");
  } catch (err) {
    return res.render("login", {
      pageTitle: "Login",
      errorMessage: "Unexpected errors happened.",
    });
  }
};
export const logout = (req, res) => {
  try {
    req.session.destroy();
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};
