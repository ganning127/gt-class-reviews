import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import Confetti from 'react-confetti';
import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";

export default function ReviewSubmitted()
{
    {
        const router = useRouter();
        const [dims, setDims] = useState([2000, 2000]);

        useEffect(() =>
        {
            setDims([window.innerWidth, window.innerHeight]);
        }, []);

        const courseCode = router.query.courseCode;

        return (
            <>
                <NextSeo
                    title="Review Submitted | GT Class Reviews"
                    description="Thank you for submitting a class review!"
                />


                <Box height='80vh'>
                    <Confetti
                        width={dims[0]}
                        height={dims[1]}
                    />

                    <NavBar />

                    <Center my={8} p={4} maxW='500px' mx='auto'>
                        <Box textAlign='center'>
                            <Heading color='#B3A369'>Thank you for submitting a review{courseCode ? ` for ${courseCode}!` : "!"}</Heading>

                            <Text mt={4}>People like you make GT Class Reviews possible!</Text>

                            {
                                courseCode ? (
                                    <Button as='a' href={`/class/${courseCode.toLowerCase().replaceAll(' ', '')}`} bg='#B3A369' color='white' mt={8} _hover={{
                                        bg: "#876f17"
                                    }}>Check out {courseCode} reviews</Button>
                                ) : (
                                    <Button as='a' href='/explore' bg='#B3A369' color='white' mt={8} _hover={{
                                        bg: "#876f17"
                                    }}>Explore Classes</Button>
                                )
                            }
                        </Box>
                    </Center>
                </Box>

                <Footer />
            </>
        );
    };
}
