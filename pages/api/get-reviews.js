import clientPromise from "../../lib/mongodb";


export default async function GET(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const reviewCollection = db.collection("reviews");

    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    console.log(skip);
    let newReviews = await reviewCollection.find({}).sort({ created_at: -1 }).skip(skip).limit(limit).toArray();

    res.json(newReviews);  // send JSON data back to client
}
