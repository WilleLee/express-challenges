import Movie from "../models/Movie";

export const movie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.redirect("/", { errorMessage: "no such movie" });
    }
    return res.render("movies/movie", { pageTitle: movie.title, movie, id });
  } catch (err) {
    console.log(err);
    return res.redirect("/", { errorMessage: "uncaught error" });
  }
};
export const getEditMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.redirect("/", { errorMessage: "no such movie" });
    }
    const genres = movie.genres ? movie.genres.join(",") : [];
    return res.render("movies/editMovie", {
      pageTitle: "Edit Your Movie",
      movie,
      genres,
    });
  } catch (err) {
    console.log(err);
    return res.redirect(`/movies/${id}`, { errorMessage: "uncaught error" });
  }
};
export const postEditMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year) {
      return res.redirect(`/movies/${id}/edit`, {
        errorMessage:
          "Information on title, note, rating and year must be sent.",
      });
    }
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.redirect("/", { errorMessage: "no such movie" });
    }
    await Movie.findByIdAndUpdate(id, {
      title,
      note,
      rating,
      year,
      genres: genres ? genres.split(",").map((genre) => genre.trim()) : [],
    });
    return res.redirect(`/movies/${id}`);
  } catch (err) {
    console.log(err);
    return res.redirect(`/movies/${id}`, { errorMessage: "uncaught error" });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id);
  return res.redirect("/");
};
