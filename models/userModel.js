import { MongoClient } from 'mongodb';
import { generateToken } from '../services/tokenService.js';
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
          // Generate JWT
        const token = generateToken(user);
        return { token, user };
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

async function userRegister(username, password, nickname, profile) {
    try {
        const collection = db.collection(collectionName);

        // Check if the username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }

        // Base64 encode the profile
        const profile64 = Buffer.from(profile).toString('base64');

        const newUser = {
            username,
            password,
            nickname,
            profile: profile64
        };

        const result = await collection.insertOne(newUser);
        if (result.acknowledged) {
            return { success: true, message: 'User registered successfully' };
        } else {
            return { success: false, message: 'Failed to register user' };
        }
    } catch (error) {
        console.error('Error registering user', error);
        return { success: false, message: 'An error occurred during registration' };
    }
}

async function checkUserAndPass(username, password) {
    try {
        const user = await getUserByUsername(username);
        
        // If user is found, verify the password
        if (user && verifyPassword(user, password)) {
            return { success: true, user };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    } catch (error) {
        console.error('Error checking user and password', error);
        return { success: false, message: 'An error occurred while checking credentials' };
    }
}

function verifyPassword(user, password) {
    return user.password === password; 
}

export default { getUserByUsername, updateUserByUsername, deleteUserByUsername, verifyPassword, userRegister, checkUserAndPass };
