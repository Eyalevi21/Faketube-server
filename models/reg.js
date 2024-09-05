import { MongoClient } from 'mongodb';

async function connectToDatabase() {
    const client = new MongoClient("mongodb://localhost:27017");
    try {
        await client.connect();
        const db = client.db('Faketube');
        const usersCollection = db.collection('users');
        return { client, usersCollection };
    } catch (error) {
        console.error('Failed to connect to the database', error);
        throw error;
    }
}


async function registerUser(username, password, nickname, profile) {
    const { client, usersCollection } = await connectToDatabase();
    const profile64 = btoa(profile)


    try {
        // Check if the username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }

        // Insert the new user
        const newUser = {
            username,
            password,
            nickname,
            profile: profile64
        };



        const result = await usersCollection.insertOne(newUser);
        if (result.acknowledged) {
            return { success: true, message: 'User registered successfully' };
        } else {
            return { success: false, message: 'Failed to register user' };
        }
    } catch (error) {
        console.error('Error registering user', error);
        return { success: false, message: 'An error occurred during registration' };
    } finally {
        await client.close();
    }
}

export default {
    registerUser
};

