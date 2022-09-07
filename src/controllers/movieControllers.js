import {
  getMovies,
  getMovieById,
  getMovieByMinimumYear,
  getMovieByMinimumRating,
} from "../movieDB";

export const movies = (req, res) => {
  const movies = getMovies();
  return res.render("movies/home", { pageTitle: "Movies!", movies });
};
export const movieDetail = (req, res) => {
  const { id } = req.params;
  const movie = getMovieById(id);
  return res.render("movies/movie", { pageTitle: movie.title, movie });
};
export const filterMovie = async (req, res) => {
  const { year, rating } = req.query;
  const byYear = year ? getMovieByMinimumYear(year) : undefined;
  const byRating = rating ? getMovieByMinimumRating(rating) : undefined;
  let movies;
  let sort;
  if (!byYear && !byRating) {
    return res.redirect("/");
  } else if (!byYear && byRating) {
    sort = `rating: ${rating}`;
    movies = byRating;
  } else if (byYear && !byRating) {
    sort = `year: ${year}`;
    movies = byYear;
  } else if (byYear && byRating) {
    sort = `year: ${year} & rating: ${rating}`;
    movies = byYear.filter((movie) => byRating.includes(movie));
  } else {
    return res.redirect("/");
  }
  return res.render("movies/filter", {
    pageTitle: `Searching by ${sort}`,
    movies,
  });
};
