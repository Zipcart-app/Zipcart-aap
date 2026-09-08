const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let db;

app.get("/", (req, res) => {
res.send("ZipCart Backend is running!");
});

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "ZipCart API is working"
});
});

async function startServer() {
try {
if (!MONGODB_URI) {
console.error("MONGODB_URI is not configured");
process.exit(1);
}

```
const client = new MongoClient(MONGODB_URI);

await client.connect();

db = client.db("zipcart");

console.log("MongoDB connected successfully");

app.listen(PORT, () => {
  console.log(`ZipCart server running on port ${PORT}`);
});
```

} catch (error) {
console.error("Server error:", error.message);
process.exit(1);
}
}

startServer();
