import { useState, useEffect } from 'react';
import axios from 'axios';
import Watchlist from './Watchlist';

// Add poster_path to the Movie interface
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

// Mood-to-genre mapping
const moodGenres: { [key: string]: string } = {
  'Feel Good': '35', // Comedy
  'Adventurous': '12', // Adventure
  'Romantic': '10749', // Romance
  'Thrilling': '53', // Thriller
  'Scary': '27', // Horror
  'Dramatic': '18', // Drama
  'Mysterious': '9648', // Mystery
  'Exciting': '28', // Action
  'Magical': '14', // Fantasy
};

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // Movies state
  const [query, setQuery] = useState<string>(''); // Query state
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null); // Genre state
  const [selectedMood, setSelectedMood] = useState<string | null>(null); // Mood state
  const [genres, setGenres] = useState<Genre[]>([]); // Genres state

  // Fetch genres to populate genre dropdown
  useEffect(() => {
    // Check if genres are already stored in localStorage
    const storedGenres = localStorage.getItem('genres');
    if (storedGenres) {
      setGenres(JSON.parse(storedGenres));
    } else {
      const fetchGenres = async () => {
        try {
          const response = await axios.get(
            'https://api.themoviedb.org/3/genre/movie/list?api_key=6a4a756949036f639b0fb60069667a6d'
          );
          setGenres(response.data.genres);
          localStorage.setItem('genres', JSON.stringify(response.data.genres)); // Save to localStorage
        } catch (error) {
          console.error('Error fetching genres:', error);
        }
      };
      fetchGenres();
    }

    // Check if movies are stored in localStorage
    const storedMovies = localStorage.getItem('movies');
    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  // Fetch movies based on query, genre, or mood
  const fetchMovies = async (url: string) => {
    try {
      const response = await axios.get(url);
      setMovies(response.data.results);
      localStorage.setItem('movies', JSON.stringify(response.data.results)); // Save movies to localStorage
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Handle query search
  const handleQuerySearch = () => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=6a4a756949036f639b0fb60069667a6d&query=${query}`;
    fetchMovies(url);
    setSelectedGenre(null); // Reset genre
    setSelectedMood(null); // Reset mood
    setQuery(''); // Clear query
  };

  // Handle genre search
  const handleGenreSearch = () => {
    if (selectedGenre) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=6a4a756949036f639b0fb60069667a6d&with_genres=${selectedGenre}`;
      fetchMovies(url);
      setQuery(''); // Clear query
      // Do NOT reset mood to make mood search independent
    }
  };

  // Handle mood-based search
  const handleMoodSearch = () => {
    if (selectedMood) {
      const genre = moodGenres[selectedMood];
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=6a4a756949036f639b0fb60069667a6d&with_genres=${genre}`;
      fetchMovies(url);
      setQuery(''); // Clear query
      // Do NOT reset genre to make mood search independent
    }
  };

  return (
    <div>
      {/* Search by query */}
      <div>
        <input
          type="text"
          placeholder="Search for movies..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button onClick={handleQuerySearch}>Search</button>
      </div>

      {/* Search by genre */}
      <div>
        <select
          title='selectGenre'
          onChange={(e) => setSelectedGenre(Number(e.target.value))}
          value={selectedGenre ?? ''}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button onClick={handleGenreSearch}>Search by Genre</button>
      </div>

      {/* Search by mood */}
      <div>
        <select
          title='selectMood'
          onChange={(e) => setSelectedMood(e.target.value)}
          value={selectedMood ?? ''}
        >
          <option value="">Select Mood</option>
          {Object.keys(moodGenres).map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
        <button onClick={handleMoodSearch}>Search by Mood</button>
      </div>

      {/* Display movies */}
      <div>
        <Watchlist movies={movies} />
      </div>
    </div>
  );
};

export default MovieSearch;
