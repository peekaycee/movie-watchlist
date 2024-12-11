const express = require('express');
const fetch = require('node-fetch'); // Ensure this matches your version
const router = express.Router();

// Fetch movie details from YouTube API by title
router.get('/movie/:movieTitle', async (req, res) => {
  const { movieTitle } = req.params; // Get the movie title from the URL params
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  try {
    // Fetch movie based on title from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(movieTitle)}&key=${API_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to fetch movies from YouTube API',
        details: await response.text(), // Include error details from YouTube API
      });
    }

    const data = await response.json();
    res.json(data.items); // Send the movie data to the client
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
});

// Search movies locally by title
router.get('/', (req, res) => {
  const { title } = req.query; // Get the search query parameter
  if (!title) {
    return res.status(400).json({ error: 'Title query parameter is required' });
  }

  // Search movies by title
  const results = movies.filter((movie) =>
    movie.title.toLowerCase().includes(title.toLowerCase())
  );
  res.json(results);
});

module.exports = router;
