const { MongoClient } = require("mongodb");

async function runQuery() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("ieeevisTweets");
        const tweets = db.collection("tweet");
        const users = db.collection("users");

        const uniqueUsers = await tweets.aggregate([
            {
                $group: {
                    _id: "$user.id",
                    screen_name: { $first: "$user.screen_name" },
                    followers_count: { $first: "$user.followers_count" }
                }
            }
        ]).toArray();

        await users.deleteMany({});
        await users.insertMany(uniqueUsers);

        console.log("Users collection created!");

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

runQuery();