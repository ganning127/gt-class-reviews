// USED FOR TESTING PURPOSES ONLY; MAKES EVERY DOCUMENT IN THE DATABASE HAVE THE SAME NUMBER OF LIKES

import clientPromise from "../../lib/mongodb";


export default async function POST(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // make all likes the same in the reviewCollection
    const reviewCollection = db.collection("classes");
    await reviewCollection.updateMany({}, { "$unset": { "reviews": 1 } });

    res.json({
        "success": true
    });
}