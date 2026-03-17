const { MongoClient } = require("mongodb");

async function runQuery() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("ieeevisTweets");
        const tweets = db.collection("tweet");
        const tweetsOnly = db.collection("tweets_only");

        const newTweets = await tweets.aggregate([
            {
                $project: {
                    _id: 1,
                    text: 1,
                    user_id: "$user.id"
                }
            }
        ]).toArray();

        await tweetsOnly.deleteMany({});
        await tweetsOnly.insertMany(newTweets);


        console.log("Tweets_Only collection created!");

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

runQuery();