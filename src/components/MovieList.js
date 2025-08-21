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
    <div className="app-container">
    
      <nav className="navbar">
        <div className="navbar-brand">MovieApp</div>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/top-rated">Top Rated</a></li>
          <li><a href="/upcoming">Upcoming</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <main className="content">
        <h1 className='head-text'>Latest Movies</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="movie-list">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="movie-item" 
                onClick={() => viewMovie(movie.id)} 
                style={{ cursor: 'pointer' }}
              >
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
                <div className="details">Year: {new Date(movie.release_date).getFullYear()}</div>
                <div className="details">Rating: {movie.vote_average.toFixed(1)}</div>
                <button 
                  className="btn-view" 
                  onClick={e => { e.stopPropagation(); viewMovie(movie.id); }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      
      <footer className="footer">
        &copy; {new Date().getFullYear()} MovieApp. All rights reserved.
      </footer>

   
      <style jsx>{`
       
        .navbar {
          background: #e3f2fd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 2px solid #90caf9;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 2px 6px rgba(0, 123, 255, 0.1);
        }
        .navbar-brand {
          font-weight: 700;
          font-size: 1.5rem;
          color: #1976d2;
        }
        .navbar-links {
          list-style: none;
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }
        .navbar-links li a {
          text-decoration: none;
          color: #1976d2;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .navbar-links li a:hover {
          color: #0d47a1;
        }
        .head-text {
         color: #1976d2;
         margin-left: 6%;
         font-size:25px;
        }
        
        .footer {
          background: #e3f2fd;
          border-top: 2px solid #90caf9;
          padding: 1rem 2rem;
          text-align: center;
          color: #1976d2;
          font-weight: 600;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin-top: 2rem;
        }

        
        .movie-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

       
        .movie-item {
          background: white;
          flex: 0 1 220px;
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        .movie-item:hover {
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
        }
        .movie-item img {
          border-radius: 6px;
          width: 100%;
          height: auto;
          margin-bottom: 1rem;
        }
        .movie-item h3 {
          font-size: 1.1rem;
          margin: 0 0 0.3rem 0;
          flex-shrink: 0;
        }
        .details {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 0.3rem;
          flex-shrink: 0;
        }

        
        .movie-item button {
          margin-top: auto; /* push button down */
          background:rgb(61, 157, 252);
          border: 2px solid #90caf9;
          color: #fff;
          padding: 0.5rem 1rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          align-self: center;
          position: relative;
          bottom: 3px; 
        }
        .movie-item button:hover {
          background-color: #90caf9;
          color: white;
          border-color:rgb(55, 150, 245);
        }
      `}</style>
    </div>
  );
}

export default MovieList;
