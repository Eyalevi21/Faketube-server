import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'Faketube';
const collectionName = 'users';

let db;

// Initialize connection once
async function initializeConnection() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process if unable to connect
    }
}

// Call this function once when the app starts
initializeConnection();

async function getUserByUsername(username) {
    try {
        const collection = db.collection(collectionName);
        const user = await collection.findOne({ username });
        return user;
    } catch (error) {
        console.error('Error fetching user from database:', error);
        throw new Error('Database fetch error');
    }
}

async function updateUserByUsername(username, updateData) {
    try {
        const collection = db.collection(collectionName);

        const allowedUpdates = {};
        if (updateData.nickname) allowedUpdates.nickname = updateData.nickname;
        if (updateData.profile) allowedUpdates.profile = updateData.profile;

        const result = await collection.updateOne(
            { username }, 
            { $set: allowedUpdates }
        );
        return result;
    } catch (error) {
        console.error('Error updating user in database:', error);
        throw new Error('Database update error');
    }
}

async function deleteUserByUsername(username) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ username });
        return result;
    } catch (error) {
        console.error('Error deleting user from database:', error);
        throw new Error('Database delete error');
    }
}

export default { getUserByUsername, updateUserByUsername, deleteUserByUsername };
