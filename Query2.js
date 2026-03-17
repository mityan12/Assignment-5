const { MongoClient } = require("mongodb");

async function runQuery() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("ieeevisTweets");
        const collection = db.collection("tweet");

        const results = await collection
            .find({}, { projection: { "user.screen_name": 1, "user.followers_count": 1, _id: 0 } })
            .sort({ "user.followers_count": -1 })
            .limit(10)
            .toArray();

        console.log("Top 10 users by followers:");
        console.log(results);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

runQuery();