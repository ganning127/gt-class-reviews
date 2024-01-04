import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";


export default async function POST(req, res)
{
    // inserts into the reviews AND classes collections
    let body = JSON.parse(req.body);
    let onlyBody = body.dataObj;
    let bodyToUpdateWith = { ...onlyBody };
    delete bodyToUpdateWith["_id"];

    body["created_at"] = new Date();

    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // inserting into the main reviews collection
    const reviewCollection = db.collection("reviews");

    const classCollection = db.collection("classes");
    let classFind = await classCollection.find({ courseCode: { $eq: onlyBody.courseCode } }).toArray();
    let courseFound = classFind[0];
    let numReviews = courseFound.numReviews;

    let newNumReviewsClass = Math.max(numReviews - 1, 0); // can't go below 0
    let newAvgOverall = removeValFromAvg(courseFound.avgOverallRating, body.oldOverallRating, numReviews);
    let newAvgDiff = removeValFromAvg(courseFound.avgDiffRating, body.oldDiffRating, numReviews);
    let newAvgInterest = removeValFromAvg(courseFound.avgInterestingRating, body.oldInterestingRating, numReviews);
    let newAvgWorkload = removeValFromAvg(courseFound.avgWorkload, body.oldWorkload, numReviews);

    // add the new averages to the class averages
    let finalAvgOverall = approxRollingAverage(newAvgOverall, onlyBody.overallRating, numReviews);
    let finalAvgDiff = approxRollingAverage(newAvgDiff, onlyBody.diffRating, numReviews);
    let finalAvgInterest = approxRollingAverage(newAvgInterest, onlyBody.interestingRating, numReviews);
    let finalAvgWorkload = approxRollingAverage(newAvgWorkload, onlyBody.workload, numReviews);

    const resp = await reviewCollection.updateOne({ _id: { $eq: ObjectId(onlyBody._id) } }, { $set: bodyToUpdateWith });

    await classCollection.updateOne({ courseCode: { $eq: onlyBody.courseCode } }, [
        {
            $set: {
                avgOverallRating: finalAvgOverall,
                avgDiffRating: finalAvgDiff,
                avgInterestingRating: finalAvgInterest,
                avgWorkload: finalAvgWorkload,
            }
        }
    ]);


    res.json({
        "success": true
    });
}


const removeValFromAvg = (avg, value, oldLength) =>
{
    if ((oldLength - 1) <= 0)
    {
        return 0;
    }

    let newAverage = ((avg * oldLength) - value) / (oldLength - 1);

    return newAverage;
};


const approxRollingAverage = (avg, new_sample, newLength) =>
{
    avg -= avg / newLength;
    avg += new_sample / newLength;

    return avg;
};