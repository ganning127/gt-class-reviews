import { Link } from "@chakra-ui/next-js";
import { Box, Heading, Icon } from "@chakra-ui/react";
import { Text, Flex, Spacer, Badge } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { FaRegUser } from "react-icons/fa";
import { numberToColorHsl, numberToColorHslWorkload } from "../lib/colorFunctions";

export const ClassCard = ({ c }) =>
{
    const router = useRouter();
    return (
        <Box bg='#fffae8' borderRadius={10} p={4} onClick={() =>
        {
            router.push(`/class/${c.courseCode}`);
        }} _hover={{
            bg: "#f5e7b5",
            cursor: "pointer"
        }}>
            <Flex align='center'>
                <Box>
                    {
                        c.courseName ? (
                            <>
                                <Heading color='#B3A369'>{c.courseName}</Heading>
                                <Text fontSize='sm' color='gray.600' mt={1}>{c.courseCode.toUpperCase()}</Text>
                            </>
                        ) : (
                            <Heading color='#B3A369'>{c.courseCode.toUpperCase()}</Heading>
                        )
                    }
                </Box>
                <Spacer />
                <Flex align='center' gap={1} color='#B3A369' fontWeight='bold'>
                    <Text>{c.numReviews}</Text>
                    <Icon as={FaRegUser} />
                </Flex>
            </Flex>

            <Box mt={2}>
                <Badge bg={numberToColorHsl(c.avgOverallRating * 10)} color={c.avgOverallRating <= 2 ? 'white' : ""} mr={2}>{c.avgOverallRating.toFixed(1)} / 10 Overall</Badge>
                <Badge bg={numberToColorHsl((10 - c.avgDiffRating) * 10)} color={c.avgDiffRating <= 2 ? 'white' : ""} mr={2}>{c.avgDiffRating.toFixed(1)}/ 10 Difficulty</Badge>
                <Badge bg={numberToColorHsl(c.avgInterestingRating * 10)} color={c.avgInterestingRating <= 2 ? 'white' : ""} mr={2}>{c.avgInterestingRating.toFixed(1)} / 10 Interesting</Badge>
                <Badge bg={numberToColorHslWorkload(c.avgWorkload)} color={c.avgWorkload >= 17 ? 'white' : ""}>{c.avgWorkload.toFixed(1)} hours/week</Badge>
            </Box>

        </Box>
    );
};