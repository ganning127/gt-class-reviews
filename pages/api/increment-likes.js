import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const body = JSON.parse(req.body);
    const currLikes = body.currLikes;
    const filter = { _id: new ObjectId(body._id) };
    const resp = await db
        .collection("reviews")
        .updateOne(filter, { $set: { likes: currLikes } });

    const classCollection = db.collection("classes");
    let classFind = await classCollection.find({ courseCode: { $eq: body.courseCode } }).toArray();
    let courseFound = classFind[0];
    let classReviews = courseFound.reviews;
    // go through the classReviews array, and update the one with the _id equal to body._id and then update the likes on that one

    for (var i = 0; i < classReviews.length; i++)
    {
        if (classReviews[i]._id == body._id)
        {
            classReviews[i].likes++;
        }
    }

    await classCollection.updateOne({ courseCode: { $eq: body.courseCode } }, [
        {
            $set: {
                reviews: classReviews,
            }
        }
    ]);





    res.status(200).json({ success: true });

}