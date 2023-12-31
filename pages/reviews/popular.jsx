import { Stack, Text, Heading, Container, Divider, Spinner } from '@chakra-ui/react';
import clientPromise from '../../lib/mongodb';
import { ReviewCard } from '../../components/ReviewCard';
import { NextSeo } from 'next-seo';
import { NavBar } from '../../components/NavBar';
import { useUser } from '@clerk/nextjs';

const INITIAL_NUM = 20;

export default function MostPopularReviews({ success, initialReviews })
{
    const { user, isLoaded } = useUser();

    if (!isLoaded)
    {
        return null;
    }


    return (
        <>
            <NextSeo
                title="Most Popular Reviews | GT Class Reviews"
                description="The 20 most popular reviews of all time."
            />

            <NavBar active="popular" />

            <Container maxW='container.md' p={4}>
                <Heading fontWeight='extrabold' color='#b59318'>The {INITIAL_NUM} Most Popular Reviews <br />(based on likes)</Heading>

                <Divider mt={4} />

                <Stack direction='column' spacing={4} mt={4}>
                    {
                        initialReviews.map((review, index) =>
                        {
                            return <ReviewCard key={index} review={review} loggedInUserId={user.id} />;
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