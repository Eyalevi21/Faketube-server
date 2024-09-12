import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'Faketube';
const collectionName = 'videos';

let db;

// Initialize connection once
async function initializeConnection() {
    try {
        await client.connect();
        db = client.db(dbName);
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process if unable to connect
    }
}

// Call this function once when the app starts
initializeConnection();

async function getAllVideos() {
    try {
        const collection = db.collection(collectionName);
        const videos = await collection.find({}).toArray();
        return videos;
    } catch (error) {
        console.error('Error fetching videos from database:', error);
        throw new Error('Database fetch error');
    }
}

async function getVideo(videoId) {
    try {
        const collection = db.collection(collectionName);
        const video = await collection.findOne({ vid: videoId });
        return video;
    } catch (error) {
        console.error('Error fetching video:', error);
        throw new Error('Database fetch error');
    }
}

async function getVideosByUser(username) {
    try {
        const collection = db.collection(collectionName);
        const videos = await collection.find({ artist: username }).toArray();
        return videos;
    } catch (error) {
        console.error('Error fetching videos for user:', error);
        throw new Error('Database fetch error');
    }
}

async function updateVideoByVid(vid, updateData) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(
            { vid },
            { $set: updateData }
        );
        return result;
    } catch (error) {
        console.error('Error updating video by vid:', error);
        throw new Error('Database update error');
    }
}

async function deleteVideoByVid(vid) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ vid });
        return result;
    } catch (error) {
        console.error('Error deleting video by vid:', error);
        throw new Error('Database delete error');
    }
}

// Export functions
export default { getAllVideos, getVideo, getVideosByUser, updateVideoByVid, deleteVideoByVid };
