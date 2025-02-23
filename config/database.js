const { MongoClient } = require("mongodb");
require('dotenv').config();
const env_config = require('./cred')

const mongo_url = env_config.MONGO_URI;
const dbName = env_config.DB_NAME;

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
