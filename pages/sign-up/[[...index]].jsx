import { SignUp } from "@clerk/nextjs";
import { NavBar } from "../../components/NavBar";
import { Box } from '@chakra-ui/react';

const SignUpPage = () => (

    <>
        <title>Sign In | GT Class Reviews</title>
        <NavBar />
        <center>
            <Box h={1} my={5} />
            <SignUp />
        </center>
    </>
);

export default SignUpPage;