
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = 'mongodb+srv://rakesh:185d1a0151@project.phg7vjo.mongodb.net/Adsgoat?retryWrites=true&w=majority';

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    if (req.method === 'POST') {
     
    //   const token = generateRandomToken(164);
    const token="NrayRSNFGik9YUhWx5zkCGKo4dpne8aL4MKVZxBmpPFliFKOhzK6mT4BKXdAcIPa8fzqfZbYmXRORip9iDTnIwIQobZRX1wnWeFxtSH3Tz1cD0nOKtJYdIEutON9UXTcutVSXjFAdE000ayPGtU9FpBDawlPMoJSbT94"
      await client.db('TestData').collection('Modified_Token').deleteMany();
      await client.db('TestData').collection('Modified_Token').insertOne({ token });

      res.status(200).json(token);
      
    } else if (req.method === 'GET') {
      // Handle GET request for fetching data with token authentication
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
      }

      const isValidToken = await validateToken(client, token);

      if (!isValidToken) {
        return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
      }

      const database = await client.db('TestData').collection('Tonic_Daily').find().toArray();
      res.status(200).json(database);
      await client.close();
      
      if (client){
        console.log("Db closed")
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
    
  }
    
//   }
}

function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

async function validateToken(client, token) {
  try {
    const database2 = await client.db('TestData').collection('Modified_Token').find().toArray();
    const storedToken = database2[0]?.token;
    console.log(storedToken.length)
    return token === storedToken;
  } catch (error) {
    console.error('Error validating token:', error.message);
    return false;
  }
}









