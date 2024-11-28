import { SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";

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
    </header>
  );
};

export default Header;
