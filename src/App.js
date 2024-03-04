import { useEffect, useState } from "react";

import { MovieDetails } from './components/MovieDetails'
import { Navbar } from "./components/Navbar";


const { REACT_APP_API_KEY: API_KEY } = process.env;
const { REACT_APP_API_URL: API_URL } = process.env;

const url = `${API_URL}&apikey=${API_KEY}`
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("interstelar");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  const handleSelectMovie = (movieId) => setSelectedId(movieId === selectedId ? null : movieId);
  const handleCloseMovie = () => setSelectedId(null);

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`${url}&s=${query}`);

        if (!res.ok) {
          console.log('Fetch.error');
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();

        if (data.Response === 'False') {
          console.log('Fetch.notfound');
          throw new Error("Movie not found");
        }
        setMovies(data.Search);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length <= 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies()
  }, [query]);

  return (
    <>
      <Navbar query={query} setQuery={setQuery} movies={movies} />
      <main className="main">
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && <ListMovies movies={movies} onHandleSelectMovie={handleSelectMovie} />}
        {
          selectedId ? <MovieDetails selectedId={selectedId} onHandleCloseMovie={handleCloseMovie} /> :
            <ListMoviesWatched watched={watched} avgImdbRating={avgImdbRating} avgUserRating={avgUserRating} avgRuntime={avgRuntime} />
        }

      </main>
    </>
  );
}



const ListMovies = ({ movies, onHandleSelectMovie }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && (
        <ul className="list list-movies">
          {movies?.map((movie) => (
            <MovieItem key={movie.imdbID} {...movie} onHandleSelectMovie={onHandleSelectMovie} />
          ))}
        </ul>
      )}
    </div>
  )
}

const MovieItem = ({ imdbID, Poster, Title, Year, onHandleSelectMovie }) => {
  return (
    <li onClick={() => onHandleSelectMovie(imdbID)}>
      <img src={Poster} alt={`${Title} poster`} />
      <h3>{Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{Year}</span>
        </p>
      </div>
    </li>
  )
}

const ListMoviesWatched = ({ watched, avgImdbRating, avgUserRating, avgRuntime }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{avgImdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{avgRuntime} min</span>
              </p>
            </div>
          </div>

          <ul className="list">
            {watched.map((movie) => (
              <WatchedItem key={movie.imdbID} {...movie} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

const WatchedItem = ({ Poster, Title, imdbRating, userRating, runtime }) => {
  return (
    <li>
      <img src={Poster} alt={`${Title} poster`} />
      <h3>{Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} min</span>
        </p>
      </div>
    </li>
  )
}

const Loader = () => {
  return <p className="loader">Loading...</p>;
}


const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}