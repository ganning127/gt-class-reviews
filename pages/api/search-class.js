import clientPromise from '../../lib/mongodb';


export default async function handler(req, res)
{
    const client = await clientPromise;
    const db = client.db("GTClassReviews");
    const collection = db.collection("classes");
    const value = req.headers.value;

    try
    {
        let results = await collection.aggregate([
            {
                $search: {
                    "index": "default",
                    "text": {
                        "query": `${value}`,
                        "path": ["courseCode", "courseName"],
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 0
                        }
                    }
                }
            }
        ]).toArray();

        res.json(results);  // send data back to client as JSON 
    } catch (e)
    {
        res.status(500).json({ error: "an error occurred" });
    }
}