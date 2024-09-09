import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017'; // Connection string to your MongoDB database
const client = new MongoClient(uri);

const dbName = 'Faketube'; 
const collectionName = 'videos'; 

async function getAllVideos() {
    try {
        await client.connect(); // Connect to MongoDB

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Fetch all videos
        const videos = await collection.find({}).toArray();
        return videos;

    } catch (error) {
        console.error('Error fetching videos from database:', error);
        throw new Error('Database fetch error');
    } finally {
        await client.close(); // Close the connection after the query
    }
}

export default { getAllVideos };
