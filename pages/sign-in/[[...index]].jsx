import { SignIn } from "@clerk/nextjs";
import { NavBar } from "../../components/NavBar";
import { Box } from '@chakra-ui/react';

const SignInPage = () => (
    <>
        <title>Sign In | GT Class Reviews</title>
        <NavBar />
        <center>
            <Box h={1} my={5} />
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/" />
        </center>
    </>
);

export default SignInPage;