const { MongoClient } = require("mongodb");

const mongo_url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

async function connectDB() {
  let client;

  try {
    client = new MongoClient(mongo_url, { useUnifiedTopology: true,  });

    await client.connect();
    console.log("---------Connected to MongoDB successfully!----------");
    const db = client.db(dbName);

    const collection = db.collection("my-app");
    const result = await collection.find({}).toArray();

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectDB;
