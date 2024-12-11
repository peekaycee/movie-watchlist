require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies'); // Movies route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Movies API routes
app.use('/api/movies', moviesRouter);

// Server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
