const { MongoClient } = require("mongodb");

async function runQuery() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("ieeevisTweets");
        const collection = db.collection("tweet");

        const results = await collection.aggregate([
            {
                $group: {
                    _id: "$user.screen_name",
                    tweetCount: { $sum: 1 },
                    avgRetweets: { $avg: "$retweet_count" }
                }
            },
            {
                $match: {
                    tweetCount: { $gt: 3 }
                }
            },
            {
                $sort: { avgRetweets: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray();

        console.log("Top 10 users by average retweets (with >3 tweets):");
        console.log(results);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

runQuery();