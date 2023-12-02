import express, { response } from 'express';
import { MongoClient } from 'mongodb';
import axios from 'axios';

const app=express();
const PORT=5001;
const uri='mongodb+srv://rakesh:185d1a0151@project.phg7vjo.mongodb.net/Adsgoat?retryWrites=true&w=majority';
const client=new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });


const startServer = async ()=>{
    try{
        app.listen(PORT,()=>{
        console.log("Server is Connected",`${PORT}`)
    })
    }catch(e){
        console.error("Server is not connected",e)
    }
}
startServer()



app.post('/ads/rakesh',(req,res)=>{
    function generateRandomToken(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
        //   console.log(Math.random()*characters.length)
          token += characters.charAt(randomIndex);
        }
        res.status(200).json(token)
        return token;
      }
      
      const randomToken = generateRandomToken(164);
      // console.log(randomToken);

});



async function Storingtoken(){
  // const response = await axios.post(`http://localhost:${PORT}/ads/rakesh`);
    //  const  token3=response.data
  const token3 = "8dIEOgHedjZTqQo15LDbcDBWMLsOUEe8eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkc2dvYXQiLCJpYXQiOjE3MDA4MDQ0NjUsImV4cCI6MTcwMDg5MDg2NX0.czm-qBRevTdNYBSbNHS";
 // console.log(token3)
  try {
    await client.connect();
    await client.db('TestData').collection('Modified_Token').deleteMany();
    const database1 = await client.db('TestData').collection('Modified_Token').insertOne({ token: token3 });

    // console.log(database1);
  } catch(error){
    console.err("Database not connected")
  }
  
}



async function Authentication(req, res, next) {
  Storingtoken()
  try {
    
      const database2 = await client.db('TestData').collection('Modified_Token').find().toArray();
      const token=database2[0].token
      console.log(token);
      const token1=req.headers.authorization
      let  token2=""
      if (token1===""){
        res.status(400).json("enter Token")
        res.end();

      }else{
         token2=token1.split(" ")[1]
            }
      // console.log(token2)
      
  if(token===token2){
      if (!token) {
        console.log("Token is invalid.");
        res.status(401).json({ error: "Authentication failed" });
      } else {
        console.log("Token is Valid!");
        req.token = token2;
        next();
        
      }
    } else{
      console.log("enter valid token")
      res.status(400).json("Enter Valid Token")
        res.end();
    }
  }catch (error) {
      console.error('Error fetching token:', error.message);
      res.status(400).json({ error: "Enter Valid Token" });
    }
  }





app.get("/ads/result", Authentication, async (req, res) => {
    try {      
      const database = client.db('TestData').collection('Tonic_Daily').find().toArray();
      if(!database){
        console.log("Database is not connected")
      }else{
        const data = await database;
        res.json(data);
        console.log("Fetched Data:",data.length)

        
      }
    } catch (err) {
      res.status(400).json(err);
      console.error("Error", err);
    }finally{
      await client.close();
      console.log("db closed")
    }
  });
  
