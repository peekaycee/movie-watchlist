import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {

  return (
    <div>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default SignInPage;
