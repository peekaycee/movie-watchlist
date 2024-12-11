import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface Movie {
  title: string;
  overview: string;
  poster_path: string;
}

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

const WatchMovie = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setMovie(data);

        // Fetch the YouTube video for the movie title
        fetchYouTubeVideo(data.title);
      } catch (error) {
        setError(`${error}`);
      }
    };

    // Fetch the YouTube video for the movie title
    const fetchYouTubeVideo = async (movieTitle: string) => {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 
      console.log("API_KEY in fetchYouTubeVideo: ", API_KEY);

      if (!API_KEY) {
        throw new Error("Missing YouTube API Key");
      }
      
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle)}&key=${API_KEY}`;


      try {
        const response = await fetch(searchUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch YouTube video");
        }

        const data = await response.json();
        
        if (data.items.length > 0) {
          setVideo(data.items[0]); // Take the first video from the results
        } else {
          setError("No YouTube video found for this movie");
        }
      } catch (error: unknown) {
        setError(`Failed to fetch YouTube video: ${(error as Error).message}`);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie || !video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
      />
      <h2>Watch Video</h2>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${video.id.videoId}`}
        title={video.snippet.title}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default WatchMovie;
