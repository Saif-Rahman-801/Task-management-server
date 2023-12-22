const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "https://marvelous-medovik-366b22.netlify.app",
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86h0qhu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("TodoDB");
    const todoCollections = database.collection("TodoCollections");
    const pendingCollections = database.collection("pendingCollections");

    app.post("/todos", async (req, res) => {
        const user = req.body;
        const result = await todoCollections.insertOne(user);
        res.send(result);
    });

    app.get("/todos", async (req, res) => {
        const cursor = todoCollections.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    app.post("/pending", async (req, res) => {
        const user = req.body;
        const result = await pendingCollections.insertOne(user);
        res.send(result);
    });

    app.get("/pending", async (req, res) => {
        const cursor = pendingCollections.find();
        const result = await cursor.toArray();
        res.send(result);
      });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HEllO WORLD");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
