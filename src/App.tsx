import { Route, Routes } from "react-router-dom";
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';
import Dashboard from "./components/dashboard/Dashboard";
import Homepage from "./components/homepage/Homepage";
import NotFoundPage from "./components/notFound/NotFoundPage";
import Layout from "./components/layout/Layout";
import MovieSearch from "./components/movies/MovieSearch";
import WatchMovie from "./components/movies/WatchMovie";

function App() {
  return (
    <>
      <Layout />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/movies" element={<MovieSearch />} />
        <Route path="/watch/:movieId" element={<WatchMovie />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Other routes */}
      </Routes>
    </>
  );
}

export default App;
