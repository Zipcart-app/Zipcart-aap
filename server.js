const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "zipcart";

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ZipCart backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ZipCart API is working"
  });
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not configured");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    const db = client.db(DB_NAME);

    await db.command({ ping: 1 });

    await db.collection("system").updateOne(
      { key: "zipcart_connection" },
      {
        $set: {
          key: "zipcart_connection",
          status: "connected",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log("MongoDB connected successfully");
    console.log("Database:", DB_NAME);
    console.log("Collection: system");

    app.locals.db = db;

    app.listen(PORT, () => {
      console.log(`ZipCart server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

startServer();
