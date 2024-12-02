import { SignedOut } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import './header.css'

const Header = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <header>
      <SignedOut>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignUp}>Sign Up</button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <nav>
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/movies'}>Movies</NavLink>
      </nav>
    </header>
  );
};

export default Header;
