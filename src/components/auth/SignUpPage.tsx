import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div>
       <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
        />
    </div>
  )
}

export default SignUpPage;
