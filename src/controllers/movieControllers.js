import Movie from "../models/Movie";

export const movie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id).populate("owner");
    //populate method fills the owner part with the actual user object
    if (!movie) {
      return res.status(400).redirect("/");
    }
    return res.render("movies/movie", { pageTitle: movie.title, movie, id });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect("/");
  }
};
export const getEditMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(400).redirect("/");
    }
    const genres = movie.genres ? movie.genres.join(",") : [];
    return res.render("movies/editMovie", {
      pageTitle: "Edit Your Movie",
      movie,
      genres,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/movies/${id}`);
  }
};
export const postEditMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, note, rating, year, genres } = req.body;
    if (!title || !note || !rating || !year) {
      return res.status(400).redirect(`/movies/${id}/edit`);
    }
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(400).redirect("/");
    }
    await Movie.findByIdAndUpdate(id, {
      path: movie.path,
      title,
      note,
      rating,
      year,
      genres: genres ? genres.split(",").map((genre) => genre.trim()) : [],
    });
    return res.status(400).redirect(`/movies/${id}`);
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/movies/${id}`);
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const existing = await Movie.findById(id);
  if (!existing) {
    return res.status(400).redirect("/");
  }
  await Movie.findByIdAndDelete(id);
  return res.status(400).redirect("/");
};
