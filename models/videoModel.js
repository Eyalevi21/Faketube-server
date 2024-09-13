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

async function getVideoComments(vid) {
    try {
        const collection = db.collection('comments');

        const comments = await collection.find({ commentVid: vid }).toArray();

        return comments;
    } catch (error) {
        console.error('Error fetching comments from the database:', error);
        throw new Error('Database fetch error');
    }
}

async function addComment(commentData) {
    try {
        const collection = db.collection('comments');
        const result = await collection.insertOne(commentData);
        return result;
    } catch (error) {
        console.error('Error adding comment to database:', error);
        throw new Error('Database insert error');
    }
}


export default { getAllVideos, getVideo, getVideosByUser, updateVideoByVid, deleteVideoByVid, getVideoComments, addComment };
