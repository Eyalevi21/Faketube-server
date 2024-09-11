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

async function getVideo(videoId) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const videosCollection = db.collection(collectionName);

        // Fetch the video by its vid field
        const video = await videosCollection.findOne({ vid: videoId });
        return video;

    } catch (error) {
        console.error('Error fetching video:', error);
    } finally {
        await client.close();
    }
}

async function getVideosByUser(username) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Fetch videos where the 'artist' field matches the username
        const videos = await collection.find({ artist: username }).toArray();
        return videos;

    } catch (error) {
        console.error('Error fetching videos for user:', error);
        throw new Error('Database fetch error');
    } finally {
        await client.close();
    }
}

async function updateVideoByVid(vid, updateData) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Update video with matching vid
        const result = await collection.updateOne(
            { vid },
            { $set: updateData }
        );
        return result; // Return the result which contains the count of modified documents
    } catch (error) {
        console.error('Error updating video by vid:', error);
        throw new Error('Database update error');
    } finally {
        await client.close();
    }
}

async function deleteVideoByVid(vid) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Delete video with matching vid
        const result = await collection.deleteOne({ vid });
        return result; // Return the result which contains the count of deleted documents
    } catch (error) {
        console.error('Error deleting video by vid:', error);
        throw new Error('Database delete error');
    } finally {
        await client.close();
    }
}



export default { getAllVideos, getVideo, getVideosByUser, updateVideoByVid, deleteVideoByVid };
