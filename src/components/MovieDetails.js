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
    const movieId = localStorage.getItem('movieId');
  
    if (author && text && rating && movieId) {
      const newReview = { author, reviewText: text, rating, movieId };
  
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
  

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <div className="info">
            <span>Year: {new Date(movie.release_date).getFullYear()}</span><br />
            <span>Rating: {movie.vote_average}</span><br />
            <span>Overview: <p>{movie.overview}</p></span>
          </div>
          {movie.videos && movie.videos.results.length > 0 && (
            <div className="trailer">
              <h3>Trailer</h3>
              <iframe
                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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
    </div>
  );
}

export default MovieDetails;

