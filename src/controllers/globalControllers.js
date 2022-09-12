import Movie from "../models/Movie";

export const home = async (req, res) => {
  const movies = await Movie.find({});
  return res.render("home", { pageTitle: "Home", movies });
};
export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload Movie" });
};
export const postUpload = async (req, res) => {
  try {
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year) {
      return res.redirect("/upload", {
        errorMessage:
          "Information on title, note, rating and year must be sent.",
      });
    }
    const movie = new Movie({
      title,
      note,
      rating,
      year,
      genres: genres ? genres.split(",").map((genre) => genre.trim()) : [],
    });
    await movie.save();
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("/upload", { errorMessage: "uncaught error" });
  }
};

export const join = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const login = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
