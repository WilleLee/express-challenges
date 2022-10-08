import Movie from "../models/Movie";
import User from "../models/User";
import bcrypt from "bcrypt";
import request from "request";

const heroku = process.env.NODE_ENV || null;

const $HOME = "Home";
const $SEARCH = "Search";
const $JOIN = "Join";
const $LOGIN = "Login";

export const home = async (req, res) => {
  const movies = await Movie.find({});
  return res.render("home", { pageTitle: $HOME, movies });
};

export const search = async (req, res) => {
  try {
    const {
      query: { keyword },
    } = req;
    if (!keyword) {
      return res.redirect("/");
    }
    const movies = await Movie.find({
      title: { $regex: new RegExp(keyword, "i") },
    });
    return res.render("search", { pageTitle: $SEARCH, movies });
  } catch (err) {
    return res.status(400).redirect("/");
  }
};

export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload Movie" });
};
export const postUpload = async (req, res) => {
  try {
    const {
      loggedInUser: { _id },
    } = req.session;
    console.log(req.file);
    const {
      file: { location },
    } = req;
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year || !location) {
      return res.render("upload", {
        pageTitle: "Upload Movie",
        errorMessage: "Not Fulfilled",
      });
    }
    const movie = new Movie({
      path: location,
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
  const redirectUri = heroku
    ? encodeURI("https://expresstube.herokuapp.com/users/naver/callback")
    : encodeURI("http://localhost:3000/users/naver/callback");
  const state = "RANDOM_STATE";
  const apiUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;
  return res.render("join", { pageTitle: "Join", apiUrl });
};
export const postJoin = async (req, res) => {
  try {
    const { username, useremail, password, passwordc } = req.body;
    const existingUser = await User.exists({ useremail });
    if (existingUser) {
      return res.status(400).render("join", {
        pageTitle: $JOIN,
        errorMessage: "This useremail has already been taken.",
      });
    }
    if (password !== passwordc) {
      return res.status(400).render("join", {
        pageTitle: $JOIN,
        errorMessage: "Password confirmation failed.",
      });
    }
    await User.create({ username, useremail, password });
    return res.redirect("/login");
  } catch (err) {
    console.log(err.message);
    return res.status(400).render("join", {
      pageTitle: $JOIN,
      errorMessage: "unexpected errors happened",
    });
  }
};
const naverRedirectUri = heroku
  ? encodeURI("https://expresstube.herokuapp.com/users/naver/callback")
  : encodeURI("http://localhost:3000/users/naver/callback");
export const login = (req, res) => {
  const state = "RANDOM_STATE";
  const apiUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${naverRedirectUri}&state=${state}`;
  return res.render("login", { pageTitle: "Login", apiUrl });
};
export const naverCallback = async (req, res) => {
  const { code, state } = req.query;
  const apiUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_SECRET}&redirect_uri=${naverRedirectUri}&code=${code}&state=${state}`;
  const options = {
    url: apiUrl,
    Headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_SECRET,
    },
  };
  request.get(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("❗️ Error 1: " + response.statusCode);
      return res.status(response.statusCode).redirect("/login");
    }
    const data = JSON.parse(body);
    const header = `Bearer ${data.access_token}`;
    const memberApiUrl = "https://openapi.naver.com/v1/nid/me";
    const memberOptions = {
      url: memberApiUrl,
      headers: { Authorization: header },
    };
    request.get(memberOptions, (memberError, memberResponse, memberBody) => {
      if (memberError || memberResponse.statusCode !== 200) {
        console.log("❗️ Error 2: " + memberResponse.statusCode);
        return res.status(400).redirect("/login");
      }
      const profileData = JSON.parse(memberBody).response;
      //console.log(profileData); {id: String, nickname: String, profile_image: String, email: String}
      const { nickname, email, profile_image } = profileData;

      (async () => {
        try {
          const existingUser = await User.exists({ useremail: email });
          if (existingUser) {
            const user = await User.findOne({ useremail: email });
            req.session.loggedIn = true;
            req.session.loggedInUser = user;
            console.log("✅ already exising social user");
            return res.redirect("/");
          }
          const user = await User.create({
            username: nickname,
            useremail: email,
            naver: true,
            password: "loggedinasnaver",
            profile_image,
          });
          req.session.loggedIn = true;
          req.session.loggedInUser = user;
          console.log("✅ newly welcomed social user");
          return res.redirect("/");
        } catch (err) {
          console.log(err);
          return res.redirect("/login");
        }
      })();
    });
  });
};
export const postLogin = async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ useremail });
    const compare = await bcrypt.compare(password, user.password);
    if (user.naver) {
      return res.render("login", {
        pageTitle: $LOGIN,
        errorMessage: "Please log in through NAVER",
      });
    }
    if (!user || !compare) {
      return res.render("login", {
        pageTitle: $LOGIN,
        errorMessage: "The user doesn't exist or the password is incorrect.",
      });
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = user;
    return res.redirect("/");
  } catch (err) {
    return res.render("login", {
      pageTitle: $LOGIN,
      errorMessage: "Unexpected errors happened.",
    });
  }
};
export const logout = (req, res) => {
  try {
    req.session.loggedInUser = {};
    req.session.loggedIn = false;
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};
