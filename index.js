const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.User_DB}:${process.env.User_DB_PASS}@cluster0.bu34nfl.mongodb.net/?retryWrites=true&w=majority`;

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
  
      const classes = client.db("campusease").collection("classes");
      const studentCollection = client.db('campusease').collection('student');
      const reviewCollection = client.db('campusease').collection('review');
  
        app.get('/classes', async (req, res) => {
            const result = await classes.find().toArray();
            res.send(result)
        })

        app.get('/student', async (req, res) => {
            const email = req.query.email;
            const filter = {email: email};
            console.log(email);
            const cursor = studentCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/student', async (req, res) => {
            const student = req.body;
            const result = await studentCollection.insertOne(student);
            res.send(result);
        });

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
      
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('CampusEase is running')
})

app.listen(port, () => {
console.log(`CampusEase is listening on ${port}`);
});





// "mongobd": "^0.0.1-security.0",