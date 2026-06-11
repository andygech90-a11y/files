import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let clientPromise = null;

export default async function connectToDatabase() {
  if (!clientPromise) {
    // Add timeouts so server selection errors surface quickly instead of hanging
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      // keepAlive and other options can be added if needed
    };

    const client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      // Log and reset clientPromise so future attempts can retry
      console.error('MongoDB connection failed:', err && err.message ? err.message : err);
      clientPromise = null;
      throw err;
    });
  }

  return clientPromise;
}
