// show the most recent reviews

import Head from 'next/head';
import { Stack, Text, Heading, Container, Divider, Spinner } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import clientPromise from '../../lib/mongodb';
import { ReviewCard } from '../../components/ReviewCard';
import { useState, useEffect } from 'react';
import { NavBar } from '../../components/NavBar';

const INITIAL_NUM = 10;

export default function RecentReviews({ success, initialReviews })
{
    const [reviews, setReviews] = useState(initialReviews);  // initially populated by `getServerSideProps`; then appended with `fetchMoreCards` 
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
            const response = await fetch(`/api/get-reviews?skip=${currentSkip}&limit=${limit}`);
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
            const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

            if (bottom)
            {
                fetchMoreCards(skip);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () =>
        {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [skip]);

    if (!success)
    {
        return (
            <>
                <Container maxW='container.lg' p={4}>
                    <Text>Uh oh! Something went wrong, please refresh this page, or <Link href='mailto:gt-class-reviews@gmail.com' color='#003057' fontWeight='bold'>contact us</Link> if the problem persists.</Text>
                </Container>
            </>
        );
    }
    return (
        <>
            <Head>
                <title>Recent Reviews | GT Class Reviews</title>
            </Head>

            <NavBar />

            <Container maxW='container.md' p={4}>
                <Heading fontWeight='extrabold' color='#b59318'>Recent Reviews</Heading>

                <Divider mt={4} />


                <Stack direction='column' spacing={4} mt={4}>
                    {
                        reviews.map((review, index) =>
                        {
                            return <ReviewCard key={index} review={review} />;
                        })
                    }
                    {
                        loading && <Spinner />
                    }
                </Stack>
            </Container>
        </>
    );
}

export async function getServerSideProps()
{
    try
    {
        const client = await clientPromise;
        const db = client.db("GTClassReviews");
        const collection = db.collection("reviews");

        let reviews = await collection.find({}).limit(INITIAL_NUM).sort({ created_at: -1 }).toArray();

        reviews = JSON.parse(JSON.stringify(reviews));

        return {
            props: {
                success: true,
                initialReviews: reviews
            }
        };

    } catch (e)
    {
        console.error(e);
        return {
            props: { success: false },
        };
    }
}