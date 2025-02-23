const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();
const mongo_url = process.env.MONGO_URI || 'mongodb+srv://akmauryadev:hkS2bfUgkdpIKJmd@dbnew.7yesf.mongodb.net/userdb?retryWrites=true&w=majority';
const dbName = process.env.DB_NAME || "userdb";

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
