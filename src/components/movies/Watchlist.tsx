import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook
import { useUser } from '@clerk/clerk-react';
import './watchlist.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface Reminder {
  movieId: number;
  title: string;
  reminderTime: string;
}

interface WatchlistProps {
  movies: Movie[];
}

interface UserMetadata {
  unsafeMetadata: {
    watchlist: Movie[];
    reminders: Reminder[];
  };
}

const Watchlist: React.FC<WatchlistProps> = ({ movies }) => {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const { user, isLoaded } = useUser();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderModal, setReminderModal] = useState<{
    isOpen: boolean;
    movie: Movie | null;
  }>({ isOpen: false, movie: null });
  const [reminderTime, setReminderTime] = useState<string>('');
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    movie: Movie | null;
    reminderTime: string | null;
  }>({ isOpen: false, movie: null, reminderTime: null });

  useEffect(() => {
    if (isLoaded && user) {
      const storedData = (user as unknown as UserMetadata).unsafeMetadata || {};
      setWatchlist(storedData.watchlist || []);
      setReminders(storedData.reminders || []);
    }
  }, [isLoaded, user]);

  const saveData = async (updatedWatchlist: Movie[], updatedReminders: Reminder[]) => {
    if (user) {
      try {
        await user.update({
          unsafeMetadata: { watchlist: updatedWatchlist, reminders: updatedReminders },
        });
        setWatchlist(updatedWatchlist);
        setReminders(updatedReminders);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const updatedWatchlist = [...prev, movie];
      saveData(updatedWatchlist, reminders);
      return updatedWatchlist;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
    const updatedReminders = reminders.filter((reminder) => reminder.movieId !== movieId);
    saveData(updatedWatchlist, updatedReminders);
  };

  const openReminderModal = (movie: Movie) => {
    setReminderModal({ isOpen: true, movie });
    setReminderTime('');
  };

  const closeReminderModal = () => {
    setReminderModal({ isOpen: false, movie: null });
    setReminderTime('');
  };

  const saveReminder = () => {
    if (reminderModal.movie) {
      const newReminder = {
        movieId: reminderModal.movie.id,
        title: reminderModal.movie.title,
        reminderTime,
      };
      const updatedReminders = [
        ...reminders.filter((r) => r.movieId !== reminderModal.movie!.id),
        newReminder,
      ];
      saveData(watchlist, updatedReminders);
      closeReminderModal();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      reminders.forEach((reminder) => {
        const reminderDate = new Date(reminder.reminderTime);
        if (reminderDate <= now && !notificationModal.isOpen) {
          setNotificationModal({
            isOpen: true,
            movie: watchlist.find((movie) => movie.id === reminder.movieId) || null,
            reminderTime: reminder.reminderTime,
          });
          setTimeout(() => {
            setNotificationModal({ isOpen: false, movie: null, reminderTime: null });
          }, 10000);
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reminders, watchlist, notificationModal.isOpen]);

  const stopReminder = () => {
    setNotificationModal({ isOpen: false, movie: null, reminderTime: null });
    const updatedReminders = reminders.filter((reminder) => reminder.reminderTime !== notificationModal.reminderTime);
    saveData(watchlist, updatedReminders);
  };

  const watchMovieHandler = (movieId: number) => {
    navigate(`/watch/${movieId}`);
  };

  return (
    <div>
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No movies in your watchlist.</p>
      ) : (
        watchlist.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <button type='button' onClick={() => removeFromWatchlist(movie.id)}>Remove</button>
            <button type='button' onClick={() => watchMovieHandler(movie.id)}>Watch</button>
            {reminders.find((r) => r.movieId === movie.id) && (
              <p>
                Reminder:{" "}
                {new Date(
                  reminders.find((r) => r.movieId === movie.id)!.reminderTime
                ).toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}

      <h2>Search Results</h2>
      {movies.length === 0 ? (
        <p>No movies found. Try searching for something else.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
            <button type='button' onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
            <button type='button' onClick={() => openReminderModal(movie)}>Set Reminder</button>
            <button type='button' onClick={() => watchMovieHandler(movie.id)}>Watch</button>
          </div>
        ))
      )}

      {reminderModal.isOpen && reminderModal.movie && (
        <div className="modal">
          <h2>Set Reminder for {reminderModal.movie.title}</h2>
          <input
            title='reminder'
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <button type='button' onClick={saveReminder}>Save</button>
          <button type='button' onClick={closeReminderModal}>Cancel</button>
        </div>
      )}

      {notificationModal.isOpen && notificationModal.movie && (
        <div className="notification-modal">
          <h2>{notificationModal.movie.title} Reminder!</h2>
          <p>Reminder Time: {new Date(notificationModal.reminderTime!).toLocaleString()}</p>
          <button type='button' onClick={stopReminder}>Stop Reminder</button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
