const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

const app =express();
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfrdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("vacationTravel");
      const allPackages = database.collection("packages");
      const allOrderPackages = database.collection("orderPackages");

      // get all packages data
      app.get('/packages',async(req,res)=>{
          const result=await allPackages.find({}).toArray();
          res.json(result)
      })

      // get single packages data
      app.get('/packages/:id',async(req,res)=>{
          const id =req.params.id;
          const query={_id:ObjectId(id)}
          const result= await allPackages.findOne(query);
          res.json(result)
      })

    //   post package booking requist  on db
      app.post('/orderPackages', async ( req,res)=>{
          const data =req.body;
          const result = await allOrderPackages.insertOne(data);
          res.json(result)
      })

    //   get a single user all order packages
      app.get('/orderPackages/:email', async (req,res)=>{
          const email = req.params.email;
          const query = { email:{ $in:[email]}}
          const result = await allOrderPackages.find(query).toArray()
          res.json(result)
      })

      // delete a single order package
      app.delete('/orderPackages/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await allOrderPackages.deleteOne(query)
        res.json(result)
    })

      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('YOU ARE CONNECTING')
})

app.listen(port,()=>{
    console.log("server running")
})