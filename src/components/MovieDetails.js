import { useEffect, useState } from "react";

const { REACT_APP_API_URL: API_URL } = process.env;

export const MovieDetails = ({ selectedId, onHandleCloseMovie, watched }) => {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    Title: title,
    Poster: poster,
    Plot: plot,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    ImdbRating: imdbRating,
  } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setError("");
        setIsLoading(false);
      }
    };

    if (selectedId) {
      fetchMovie();
    }
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onHandleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}
        </>
      )}
    </div>
  );
};

function Loader() {
  return <p className="loader">Loading...</p>;
}
