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
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${query}`
    );
    setMovies(response.data.results);
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
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;
