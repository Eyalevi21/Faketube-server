import { MongoClient } from 'mongodb';

async function checkUserAndPass(username, password) {
    const client = new MongoClient("mongodb://localhost:27017");
    try {
        const db = client.db('Faketube');
        const usersCollection = db.collection('users');
        
        // Find the user by username and password
        const user = await usersCollection.findOne({ username: username, password: password });
        
        // If the user is found, return the user data and profile picture
        if (user) {    
            return { success: true, user: user }; // Assuming `profile` contains the profile picture
        } else {
            return { success: false, message: "Invalid username or password" };
        }
    } finally {
        await client.close();
    }
}

export default {
    checkUserAndPass
};
