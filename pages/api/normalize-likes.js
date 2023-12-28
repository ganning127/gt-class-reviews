// USED FOR TESTING PURPOSES ONLY; MAKES EVERY DOCUMENT IN THE DATABASE HAVE THE SAME NUMBER OF LIKES

import clientPromise from "../../lib/mongodb";


export default async function POST(req, res)
{
    const LIKE_NUM = 3;
    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // make all likes the same in the reviewCollection
    const reviewCollection = db.collection("reviews");
    await reviewCollection.updateMany({}, [
        { $set: { likes: LIKE_NUM } }
    ]);

    // go through each document in 
    const classCollection = db.collection("classes");
    let classDocuments = await classCollection.find({}).toArray();

    for (let i = 0; i < classDocuments.length; i++)
    {
        for (let j = 0; j < classDocuments[i].reviews.length; j++)
        {
            classDocuments[i].reviews[j].likes = LIKE_NUM;
        }
    }

    await classCollection.deleteMany({});
    await classCollection.insertMany(classDocuments);

    res.json({
        "success": true
    });
}