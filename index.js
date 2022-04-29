const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("running server");
});
const uri = `mongodb+srv://organicInventory:${process.env.DB_PASS}@cluster0.dhxbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function databaseInterface() {
  try {
    await client.connect();
    const bikeCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_COLLECTION);

    // show six bike in inventory section
    app.get("/inventory", async (req, res) => {
      const cursor = bikeCollection.find({}).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // client.close();
  }
}
databaseInterface();
app.listen(port, () => {
  console.log("server is running on port " + port);
});
