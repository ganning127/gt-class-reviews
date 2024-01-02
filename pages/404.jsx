import { Link } from "@chakra-ui/next-js";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

const NotFoundPage = () =>
{
    return (
        <>
            <NavBar />

            <Center my={8} p={4}>
                <Box textAlign='center'>
                    <Heading color='#B3A369'>Uh oh! You&apos;ve reached the 404 page.</Heading>

                    <Text mt={4}>The page you&apos;re looking for does not exist. Please <Link href='mailto:gtclassreviews@gmail.com' color='#B3A369' textDecoration='underline'>contact us</Link> if this issue persists.</Text>

                    <Button leftIcon={<ArrowBackIcon />} as='a' href='/' bg='#B3A369' color='white' mt={8} _hover={{
                        bg: "#876f17"
                    }}>Back to Home</Button>
                </Box>
            </Center>

            <Footer />
        </>
    );
};

export default NotFoundPage;
