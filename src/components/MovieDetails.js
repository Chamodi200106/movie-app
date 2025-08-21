import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = '1c7ccd53544689193199e2ac1ec7fc00';


function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const movieId = localStorage.getItem('movieId');

  useEffect(() => {
    if (movieId) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US&append_to_response=videos,images`)
        .then(response => {
          setMovie(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching movie details:', error);
          setLoading(false);
        });

      axios
        .get(`http://localhost:5000/api/reviews/${movieId}`)
        .then(response => {
          setReviews(response.data);
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [movieId]);

  const addReview = () => {
    const author = document.getElementById('review-author').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const rating = document.getElementById('review-rating').value;
    const movieIdStored = localStorage.getItem('movieId');

    if (author && text && rating && movieIdStored) {
      const newReview = { author, reviewText: text, rating, movieId: movieIdStored };

      axios
        .post(`http://localhost:5000/api/reviews`, newReview)
        .then(response => {
          console.log('Review added:', response.data);
          setReviews(prevReviews => [...prevReviews, newReview]);
          alert('Review added successfully!');
        })
        .catch(error => {
          console.error('Error adding review:', error);
          alert('Failed to add review');
        });

      document.getElementById('review-author').value = '';
      document.getElementById('review-text').value = '';
      document.getElementById('review-rating').value = '';
    } else {
      alert('Please fill in all fields.');
    }
  };

  
  const maxStars = 5;
  const ratingOutOfFive = movie ? Math.round((movie.vote_average / 10) * maxStars) : 0;

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <div className="info">
            <span>Year: {new Date(movie.release_date).getFullYear()}</span><br />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}><span>MovieApp Rating: </span>
              <div className="rating-stars" aria-label={`Rating: ${ratingOutOfFive} out of ${maxStars} stars`}>
                {'★'.repeat(ratingOutOfFive)}
                {'☆'.repeat(maxStars - ratingOutOfFive)}
              </div>
              <span className="rating-count">{ratingOutOfFive} / {maxStars}</span>
            </div>
            <span>Tmdb Rating: {movie.vote_average}</span><br />
            <span>Overview:</span>
            <p>{movie.overview}</p>
          </div>
          {movie.videos && movie.videos.results.length > 0 && (
            <div className="trailer">
              <h3>Trailer</h3>
              <iframe
                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Movie Trailer"
              />
            </div>
          )}
          <div className="movie-images">
            <h3>Images</h3>
            <div>
              {movie.images.backdrops.slice(0, 4).map(image => (
                <img
                  key={image.file_path}
                  src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                  alt={movie.title}
                />
              ))}
            </div>
          </div>

          <div className="reviews">
            <h3>Reviews</h3>
            <div className="review-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p>{review.review_text}</p>
                  <span className="review-author">By {review.reviewer_name}</span>
                  <div className="review-rating">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="add-review">
              <h4>Add Your Review</h4>
              <input type="text" id="review-author" placeholder="Your Name" />
              <textarea id="review-text" placeholder="Your review..." rows="4"></textarea>
              <input type="number" id="review-rating" max="5" min="1" placeholder="Rating (1-5)" />
              <button onClick={addReview}>Add Review</button>
            </div>
          </div>
        </div>
      )}

    
      <footer className="footer">
        &copy; {new Date().getFullYear()} MovieApp. All rights reserved.
      </footer>

 
      <style jsx>{`
        .app-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 0;
          margin: 0;
          background-color: #f9f9f9;
          color: #333;
        }
        .review-rating {
          display: flex;
          gap: 4px;
        }
        .star {
          color: #ffca28;
          font-size: 20px;
        }
        .navbar {
          background: #e3f2fd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 2px solid #90caf9;
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
        .movie-details {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(25, 118, 210, 0.1);
        }
        .info span {
          font-weight: 600;
          color: #1976d2;
        }
        .info p {
          margin-top: 0.5rem;
          line-height: 1.5;
          color: #555;
        }
        .rating-stars {
          color: #ffca28;
          font-size: 20px;
          white-space: nowrap;
        }
        .rating-count {
          font-weight: 600;
          color: #1976d2;
          font-size: 16px;
        }
        .trailer {
          margin: 1.5rem 0;
          text-align: center;
        }
        .trailer iframe {
          width: 100%;
          max-width: 640px;
          height: 360px;
          border-radius: 8px;
        }
        .movie-images div {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .movie-images img {
          width: 150px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(25, 118, 210, 0.1);
        }
        .reviews {
          margin-top: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 20px;
        }
        .review-list .review-item {
          border-bottom: 1px solid #ddd;
          padding: 0.75rem 0;
        }
        .review-author {
          font-weight: 600;
          color: #1976d2;
        }
        .add-review {
          margin-top: 1rem;
        }
        .add-review input,
        .add-review textarea,
        .add-review input[type="number"] {
          padding: 1.5rem;
          margin-bottom: 0.75rem;
          border: 1px solid #90caf9;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        .add-review button {
          background: rgb(61, 157, 252);
          border: 2px solid #90caf9;
          color: #fff;
          padding: 0.9rem 1rem;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .add-review button:hover {
          background-color: #90caf9;
          color: white;
          border-color: rgb(55, 150, 245);
        }
        .footer {
          background: #e3f2fd;
          border-top: 2px solid #90caf9;
          padding: 1rem 2rem;
          text-align: center;
          color: #1976d2;
          font-weight: 600;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}

export default MovieDetails;
