import { useState } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
}

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');

  const fetchMovies = async () => {
    if (!query) return; // Prevent empty search requests

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=6a4a756949036f639b0fb60069667a6d&query=${query}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for movies..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchMovies}>Search</button>
      <div>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id}>
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
