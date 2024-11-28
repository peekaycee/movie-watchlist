import { useState } from 'react';

interface WatchlistProps {
    movies: Movie[];
  }
  
  const Watchlist: React.FC<WatchlistProps> = ({ movies }) => {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
  
    const addToWatchlist = (movie: Movie) => {
      setWatchlist((prev) => [...prev, movie]);
    };
  
    return (
      <div>
        <h2>Your Watchlist</h2>
        {watchlist.map((movie, index) => (
          <div key={index}>
            <h3>{movie.title}</h3>
          </div>
        ))}
        <h2>Search Results</h2>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <button onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default Watchlist;
  