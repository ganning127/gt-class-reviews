import clientPromise from "../../lib/mongodb";


export default async function GET(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const reviewCollection = db.collection("reviews");

    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const headers = JSON.parse(JSON.stringify(req.headers));

    let filter;
    let sort;

    if (req.query.type === "recent")
    {
        filter = {};
        sort = { created_at: -1 };
    } else if (req.query.type === "classPage")
    {
        filter = {
            courseCode: { $eq: foundClass.courseCode }
        };
        sort = { likes: -1 };

    }

    console.log(skip);
    let newReviews = await reviewCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();

    res.json(newReviews);  // send JSON data back to client
}
