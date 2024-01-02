// USED FOR TESTING PURPOSES ONLY; MAKES EVERY DOCUMENT IN THE DATABASE HAVE THE SAME NUMBER OF LIKES

import clientPromise from "../../lib/mongodb";


export default async function GET(req, res)
{
    const COLLECTION_TO_EMPTY = "users"; // modify this line

    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // delete all data in this collection
    const collection = db.collection(COLLECTION_TO_EMPTY);
    await collection.deleteMany({});

    res.json({
        "success": true
    });
}