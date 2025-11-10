const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const propertiesCollection =db.collection('properties');
    const addPropertiesCollection =db.collection('addProperties');
    const userCollection =db.collection('user')

    // user
    app.post('/users', async(req,res)=>{
      const newUsers  =req.body;
      const email =req.body.email;
      const query ={email:email}
      const existingUser =await userCollection.findOne(query)
      if(existingUser){
        res.send({message:'user already exit'})
      }
      else{

        const result =await userCollection.insertOne(newUsers)
        res.send(result)
      }
    })
    // properties
    
    app.get('/properties', async(req, res)=>{
      console.log(req.query)
      const email =req.query.email;
      const query  ={};
      if(email){
        query["posted_by.email"]=email;
      }
        const cursor =propertiesCollection.find(query);
        const result  =await cursor.toArray();
        res.send(result)
    })
    app.get('/latest-properties', async(req,res)=>{
      const cursor =propertiesCollection.find().sort({posted_date:-1}).limit(6)
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/properties/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={_id :new ObjectId(id)}
        const result =await propertiesCollection.findOne(query)
        res.send(result)
    })
    app.post('/properties', async(req,res)=>{
        const newProperties =req.body;
        const result =await propertiesCollection.insertOne(newProperties)
        res.send(result)
    })

    app.patch('/properties/:id',async(req,res)=>{
        const id =req.params.id;
        const updateProperties =req.body;
        const query ={_id :new ObjectId(id)}
        const update  ={
            $set:{
                name:updateProperties.name,
                email: updateProperties.email
            }
        }
        const result =await propertiesCollection.updateOne(query,update)
        res.send(result)
    })
    app.delete('/properties/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={_id: new ObjectId(id)}
        const result =await propertiesCollection.deleteOne(query)
        res.send(result)
    })


    // add properties related
    app.get('/addProperties',async(req,res)=>{
      const email =req.query.email;
      const query ={}
      if(email){
        query["posted_by.email"]=email;
      }
      const cursor  =addPropertiesCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/addProperties' ,async(req,res)=>{
      const newAddProperties =req.body;
      const result= await addPropertiesCollection.insertOne(newAddProperties)
      res.send(result)
    })
    app.get('/addProperties/:id' ,async(req,res)=>{
      const id =req.params.id;
      const query ={_id: new ObjectId(id)}
      const result =await addPropertiesCollection.findOne(query)
      res.send(result)
    })
    app.delete('/addProperties/:id' ,async (req, res)=>{
      const id =req.params.id;
      const query ={_id : new ObjectId(id)}
      const result =await addPropertiesCollection.deleteOne(query)
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

