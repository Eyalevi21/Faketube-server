import { MongoClient } from 'mongodb';

async function read() {
    const client = new MongoClient("mongodb://localhost:27017");
    try {
        const db = client.db('Faketube');
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();
        return users;
    } finally {
        await client.close();
    }
}

async function checkUserandPass(username, password) {
    const users = await read(); // Fetch the users from the database
    for (const user of users) {
        if (user.username === username && user.password === password) {
            return { success: true, user: user, picture: user.profile }; // Return profile picture here
        }
    }
    return { success: false };
}

export default {
    checkUserandPass
};
