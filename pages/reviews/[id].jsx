import Head from 'next/head';
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

import { Container } from '@chakra-ui/react';
import { ReviewCard } from '../../components/ReviewCard';
import { Link } from "@chakra-ui/next-js";
import { Text } from '@chakra-ui/react';
import { NavBar } from '../../components/NavBar';
import { NextSeo } from 'next-seo';

export default function ReviewReview({ review })
{
    return (
        <>
            <NextSeo
                title={`${review.reviewTitle} | GT Class Reviews`}
                description={review.reviewComments}
            />

            <NavBar />

            <Container maxW='container.md' p={4}>
                <ReviewCard review={review} />

                <Text mt={4} textAlign='center'><Link href='/reviews/recent' color='#B3A369' textDecoration='underline'>← View recent reviews</Link></Text>
            </Container>
        </>
    );


}


export async function getServerSideProps(context)
{
    const id = context.query.id;
    const objId = ObjectId(id);
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const classCollection = db.collection("reviews");

    const foundReview = await classCollection.find({
        _id: { $eq: objId }
    }).toArray();

    const toReturn = JSON.parse(JSON.stringify(foundReview[0]));

    return {
        props: {
            review: toReturn
        }
    };
    // try
    // {
    //     const client = await clientPromise;
    //     const db = client.db("GTClassReviews");
    //     const collection = db.collection("reviews");

    //     let reviews = await collection.find({}).limit(1).sort({ created_at: -1 }).toArray();
    //     reviews = JSON.parse(JSON.stringify(reviews));

    //     return {
    //         props: {
    //             success: true,
    //             initialReviews: reviews
    //         }
    //     };

    // } catch (e)
    // {
    //     console.error(e);
    //     return {
    //         props: { success: false },
    //     };
    // }
}