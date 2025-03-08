import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = '1c7ccd53544689193199e2ac1ec7fc00';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`)
      .then(response => {
        setMovies(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  const viewMovie = (movieId) => {
    localStorage.setItem('movieId', movieId);
    window.location.href = '/movie-details';
  };

  return (
    <div>
      <h1>Latest Movies</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-list">
          {movies.map(movie => (
            <div key={movie.id} className="movie-item" onClick={() => viewMovie(movie.id)}>
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <div className="details">Year: {new Date(movie.release_date).getFullYear()}</div>
              <div className="details">Rating: {movie.vote_average.toFixed(1)}</div>
              <button>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;