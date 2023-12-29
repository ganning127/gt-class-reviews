import clientPromise from "../../lib/mongodb";


export default async function POST(req, res)
{
    // inserts into the reviews AND classes collections
    let body = JSON.parse(req.body);
    body["likes"] = 0;
    body["created_at"] = new Date();

    const client = await clientPromise;
    const db = client.db("GTClassReviews");

    // inserting into the main reviews collection
    const reviewCollection = db.collection("reviews");
    await reviewCollection.insertOne(body);

    // inserting into the class collection
    const classCollection = db.collection("classes");

    let classFind = await classCollection.find({ courseCode: { $eq: body.courseCode } }).toArray();

    if (classFind.length == 0)
    {
        // no course document exists yet, create one here
        // should send a notification to me

        // since this is a new object, the average will be the same as the first review
        const classObj = {
            courseCode: body.courseCode,
            courseName: "",
            avgOverallRating: body.overallRating,
            avgDiffRating: body.diffRating,
            avgInterestingRating: body.interestingRating,
            avgWorkload: body.workload,
            numReviews: 1,
            reviews: [body]
        };

        await classCollection.insertOne(classObj);
    } else
    {
        // the course document already exists, update the reviews list AND update the averages

        // find the document
        let courseFound = classFind[0];
        // let newReviews = courseFound.reviews;
        // newReviews.push(body);
        let numReviews = courseFound.numReviews;

        // update the reviews
        let newAvgOverall = approxRollingAverage(courseFound.avgOverallRating, body.overallRating, numReviews + 1);
        let newAvgDiff = approxRollingAverage(courseFound.avgDiffRating, body.diffRating, numReviews + 1);
        let newAvgInterest = approxRollingAverage(courseFound.avgInterestingRating, body.interestingRating, numReviews + 1);
        let newAvgWorkload = approxRollingAverage(courseFound.avgWorkload, body.workload, numReviews + 1);

        await classCollection.updateOne({ courseCode: { $eq: body.courseCode } }, [
            {
                $set: {
                    avgOverallRating: newAvgOverall,
                    avgDiffRating: newAvgDiff,
                    avgInterestingRating: newAvgInterest,
                    avgWorkload: newAvgWorkload,
                    numReviews: numReviews + 1
                }
            }
        ]);

    }



    res.json({
        "success": true
    });
}

const approxRollingAverage = (avg, new_sample, newLength) =>
{
    avg -= avg / newLength;
    avg += new_sample / newLength;

    return avg;
};
