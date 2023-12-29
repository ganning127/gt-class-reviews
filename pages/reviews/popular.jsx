import Head from 'next/head';
import { Stack, Text, Heading, Container, Divider, Spinner } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import clientPromise from '../../lib/mongodb';
import { ReviewCard } from '../../components/ReviewCard';
import { useState, useEffect } from 'react';
import { NavBar } from '../../components/NavBar';

const INITIAL_NUM = 10;

export default function MostPopularReviews({ success, initialReviews })
{
    console.log(initialReviews);
    return (
        <>
            <Head>
                <title>Most Popular Reviews | GT Class Reviews</title>
            </Head>

            <NavBar />

            <Container maxW='container.md' p={4}>
                <Heading fontWeight='extrabold' color='#b59318'>Most Popular Reviews (based on likes)</Heading>

                <Divider mt={4} />


                <Stack direction='column' spacing={4} mt={4}>
                    {
                        initialReviews.map((review, index) =>
                        {
                            return <ReviewCard key={index} review={review} />;
                        })
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

        let reviews = await collection.find({}).limit(INITIAL_NUM).sort({ likes: -1 }).toArray();
        reviews = JSON.parse(JSON.stringify(reviews));

        console.log(reviews);
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