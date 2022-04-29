const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // show inventory in id
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = bikeCollection.find({ _id: ObjectId(id) });
      const result = await cursor.toArray();
      res.send(result);
    });

    // increase inventory quantity by id
    app.put("/inventory/addQuantity/:id", async (req, res) => {
      const id = req.params.id;
      const userQuantity = req.body.quantity;
      const cursor = bikeCollection.find({ _id: ObjectId(id) });
      const result = await cursor.toArray();
      const quantity = result[0].quantity;
      const newQuantity = parseInt(quantity) + parseInt(userQuantity);
      const update = await bikeCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { quantity: newQuantity } }
      );
      res.send(update);
    });

    // mines inventory quantity by id
    app.put("/inventory/delivery/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = bikeCollection.find({ _id: ObjectId(id) });
      const result = await cursor.toArray();
      const quantity = result[0].quantity;
      const newQuantity = parseInt(quantity) - 1;
      const update = await bikeCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { quantity: newQuantity } }
      );
      res.send(update);
    });

    // show all inventory
    app.get("/allInventory", async (req, res) => {
      const cursor = bikeCollection.find({});
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    // delete inventory by id
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bikeCollection.deleteOne({ _id: ObjectId(id) });
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
