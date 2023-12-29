import Head from 'next/head';
import clientPromise from "../../lib/mongodb";

import { Container, Flex, Heading, SimpleGrid, Text, Badge, Box, Stack, Spinner } from '@chakra-ui/react';
import { ReviewCard } from '../../components/ReviewCard';
import { Link } from "@chakra-ui/next-js";
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { useRef } from 'react';
import { useEffect, useState } from 'react';

const INITIAL_NUM = 10;

export default function Code({ foundClass, initialReviews })
{
    const scrollContainer = useRef(null);
    const [reviews, setReviews] = useState(initialReviews);
    const [skip, setSkip] = useState(initialReviews.length);
    const [loading, setLoading] = useState(false);
    const limit = 10; // how many to fetch at a time

    let isThrottled = false;
    let moreCardsExist = true;

    const fetchMoreCards = async (currentSkip) =>
    {
        if (!moreCardsExist) return;
        if (isThrottled) return;
        isThrottled = true;
        setLoading(true);

        try
        {
            const response = await fetch(`/api/get-reviews?skip=${currentSkip}&limit=${limit}?type=classPage`);
            if (response.ok)
            {
                const newReviews = await response.json();

                if (newReviews.length > 0)
                {
                    // Use functional updates to ensure you're using the most recent previous state when updating current state
                    setReviews(prevReviews => [...prevReviews, ...newReviews]);
                    setSkip(prevSkip => prevSkip + limit);
                } else
                {
                    console.log("All cards have been fetched.");
                    moreCardsExist = false;
                }
            } else
            {
                console.error('HTTP error when fetching new cards: ', response.status, response.statusText);
            }
            setLoading(false);
        } catch (e)
        {
            console.error('Error when fetching new cards: ', e);
        }

        // to prevent multiple concurrent calls which may create weird behavior 
        setTimeout(() =>
        {
            isThrottled = false;
        }, 200);
    };

    useEffect(() =>
    {
        const handleScroll = () =>
        {
            // find whether the user has scrolled to the bottom of the grid 
            const cardGrid = scrollContainer.current;
            const offset = 50;  // will fetch more cards when you scroll to within this many px of the bottom 
            const isNearBottom = cardGrid.scrollTop + cardGrid.clientHeight + offset >= cardGrid.scrollHeight;

            if (isNearBottom)
            {
                fetchMoreCards(skip);
            }
        };

        const cardGrid = scrollContainer.current;
        cardGrid.addEventListener("scroll", handleScroll);

        // this runs when the component unmounts and before each subsequent time useEffect runs 
        return () =>
        {
            cardGrid.removeEventListener("scroll", handleScroll);
        };


    }, [skip]);

    return (
        <>
            <Head>
                <title>{foundClass.courseCode.toUpperCase()} | GT Class Reviews</title>
            </Head>

            <NavBar />

            <Container maxW='container.xl' my={16}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <Box>
                        <Box p={4} borderRadius='10px' border='1px solid #f1f1f1'>
                            {
                                foundClass.courseName ? (
                                    <>
                                        <Heading color='#B3A369'>{foundClass.courseName}</Heading>
                                        <Heading mt={2} fontSize='2xl' color='gray.600'>{foundClass.courseCode.toUpperCase()}</Heading>
                                    </>
                                ) : (
                                    <Heading color='#B3A369'>{foundClass.courseCode.toUpperCase()}</Heading>
                                )
                            }

                            <Stack direction='column' mt={4} justify='flex-start' width='center' spacing={8}>
                                <Flex alignItems='center'>
                                    {/* Show the average ratings */}
                                    <Heading bg={numberToColorHsl(foundClass.avgOverallRating * 10)} color={foundClass.avgOverallRating <= 2 ? 'white' : ""} display='inline' mr={2} p={1} rounded='md'>{foundClass.avgOverallRating.toFixed(1)}</Heading>
                                    <Heading display='inline' size='md'>Average Overall Rating</Heading>
                                </Flex>

                                <Flex alignItems='center'>
                                    {/* Show the average ratings */}
                                    <Heading bg={numberToColorHsl((10 - foundClass.avgDiffRating) * 10)} color={foundClass.avgDiffRating <= 2 ? 'white' : ""} display='inline' mr={2} p={1} rounded='md'>{foundClass.avgDiffRating.toFixed(1)}</Heading>
                                    <Heading display='inline' size='md'>Average Difficulty Rating</Heading>
                                </Flex>


                                <Flex alignItems='center'>
                                    {/* Show the average ratings */}
                                    <Heading bg={numberToColorHsl((foundClass.avgInterestingRating) * 10)} color={foundClass.avgInterestingRating <= 2 ? 'white' : ""} display='inline' mr={2} p={1} rounded='md'>{foundClass.avgInterestingRating.toFixed(1)}</Heading>
                                    <Heading display='inline' size='md'>Average Interesting Rating</Heading>
                                </Flex>

                                <Flex alignItems='center'>
                                    {/* Show the average ratings */}
                                    <Heading bg={numberToColorHslWorkload(foundClass.avgWorkload)} color={foundClass.avgWorkload >= 18 ? 'white' : ""} display='inline' mr={2} p={1} rounded='md'>{foundClass.avgWorkload.toFixed(1)}</Heading>
                                    <Heading display='inline' size='md'>Average Workload (hrs/wk)</Heading>
                                </Flex>
                            </Stack>
                        </Box>
                    </Box>

                    <Stack direction='column' maxHeight="80vh" overflowY="auto" ref={scrollContainer} spacing={4}>

                        {reviews.map((review, i) =>
                        {
                            return (
                                <ReviewCard review={review} key={i} />
                            );
                        })}

                        {
                            loading && <Spinner />
                        }
                    </Stack>
                </SimpleGrid>
            </Container >
            <Footer />
        </>
    );
}

export async function getServerSideProps(context)
{
    const code = context.query.code;
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const classCollection = db.collection("classes");

    const foundClass = await classCollection.find({
        courseCode: { $eq: code }
    }).toArray();

    // ALWAYS PULLING THE MOST POPULAR REVIEWS
    const toReturn = JSON.parse(JSON.stringify(foundClass[0]));

    const reviewCollection = db.collection("reviews");
    let reviews = await reviewCollection.find({ courseCode: code }).limit(INITIAL_NUM).sort({ likes: -1 }).toArray();
    reviews = JSON.parse(JSON.stringify(reviews));


    return {
        props: {
            foundClass: toReturn,
            initialReviews: reviews
        }
    };
}


function numberToColorHsl(i)
{
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    var hue = i * 1.2 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function numberToColorHslWorkload(i)
{
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    // 0 = good
    // 20 = bad
    if (i > 20)
    {
        i = 20;
    }

    i = 20 - i;


    var hue = i * 6 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function hslToRgb(h, s, l)
{
    let r, g, b;

    if (s === 0)
    {
        r = g = b = l; // achromatic
    } else
    {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t)
{
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
