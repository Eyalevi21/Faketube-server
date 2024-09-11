import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'Faketube'; 
const collectionName = 'users'; 

async function getUserByUsername(username) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const user = await collection.findOne({ username });
        return user;

    } catch (error) {
        console.error('Error fetching user from database:', error);
        throw new Error('Database fetch error');
    } finally {
        await client.close();
    }
}

async function updateUserByUsername(username, updateData) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

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
    } finally {
        await client.close();
    }
}

async function deleteUserByUsername(username) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Delete the user by username
        const result = await collection.deleteOne({ username });
        return result;

    } catch (error) {
        console.error('Error deleting user from database:', error);
        throw new Error('Database delete error');
    } finally {
        await client.close();
    }
}

export default { getUserByUsername, updateUserByUsername, deleteUserByUsername };
