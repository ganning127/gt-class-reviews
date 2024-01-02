import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const body = JSON.parse(req.body);
    const currLikes = body.currLikes;
    const filter = { _id: new ObjectId(body._id) };
    await db
        .collection("reviews")
        .updateOne(filter, { $set: { likes: currLikes } });

    const usersCollection = db.collection("users");
    let userFind = await usersCollection.find({ "user.id": { $eq: body.userId } }).toArray();

    if (userFind.length != 0)
    {
        // this should always be true, because a user's post can only be liked if they have posted before
        console.log("user found updating...", body.userId);
        await usersCollection.updateOne({ "user.id": { $eq: body.userId } }, [
            {
                $set: {
                    totalLikes: userFind[0].totalLikes + 1
                }
            }
        ]);
    }




    res.status(200).json({ success: true });

}