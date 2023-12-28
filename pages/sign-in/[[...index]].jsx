import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
    <center>
        <title>Sign In | GT Class Reviews</title>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/" />
    </center>
);

export default SignInPage;