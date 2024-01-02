import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function POST(req, res)
{
    // inserts into the reviews AND classes collections
    let body = JSON.parse(req.body);
    let review = body.review;

    console.log("review is...", review);
    console.log(review.user.id);

    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // delete from reviewsCollection
    const reviewCollection = db.collection("reviews");
    await reviewCollection.deleteOne({
        _id: { $eq: ObjectId(review._id) }
    });

    // decrement from usersTable
    const usersCollection = db.collection("users");
    let userFind = await usersCollection.find({ "user.id": { $eq: review.user.id } }).toArray();
    let userFound = userFind[0];
    let newReviewCount = Math.max(userFound.totalReviews - 1, 0); // can't go below 0

    await usersCollection.updateOne({ "user.id": { $eq: review.user.id } }, [
        {
            $set: {
                totalReviews: newReviewCount
            }
        }
    ]);


    // decrement from classReviewCount
    const classCollection = db.collection("classes");
    let classFind = await classCollection.find({ courseCode: { $eq: review.courseCode } }).toArray();
    let courseFound = classFind[0];
    let newNumReviewsClass = Math.max(courseFound.numReviews - 1, 0); // can't go below 0

    await classCollection.updateOne({ courseCode: { $eq: review.courseCode } }, [
        {
            $set: {
                numReviews: newNumReviewsClass
            }
        }
    ]);


    res.json({
        "success": true
    });
}
