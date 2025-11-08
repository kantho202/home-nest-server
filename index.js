const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000;

// middle ware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://homeNestDbUser:AKl6DgyJjtk8egxu@simple-my-first-project.8oovgut.mongodb.net/?appName=simple-my-first-project";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db =client.db("home_nest");
    const propertiesCollection =db.collection('properties')

    app.post('/properties', async(req,res)=>{
        const newProperties =req.body;
        const result =await propertiesCollection.insertOne(newProperties)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('home-nest server is running')
})

app.listen(port,()=>{
    console.log(`home-nest server running on is port: ${port}`)
})

