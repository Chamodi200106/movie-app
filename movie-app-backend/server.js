const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');



const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie_db',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});


db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
    connection.release();
});


app.post('/api/reviews', async (req, res) => {
    const { author, reviewText, rating, movieId } = req.body;

    if (!author || !reviewText || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = 'INSERT INTO reviews (movie_id, review_text, reviewer_name, rating) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [movieId, reviewText, author, rating]);
        res.status(200).json({ message: 'Review added successfully', reviewId: result.insertId });
    } catch (err) {
        console.error('Error inserting review:', err);
        res.status(500).json({ error: 'Failed to save review' });
    }
});


app.get('/api/reviews/:movieId', async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const query = 'SELECT reviewer_name, review_text, rating FROM reviews WHERE movie_id = ?';
        const [results] = await db.promise().query(query, [movieId]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
