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
        // 1. Delete the user from the users collection
        const usersCollection = db.collection('users');
        const userResult = await usersCollection.deleteOne({ username });

        // 2. Delete the user's comments from the comments collection
        const commentsCollection = db.collection('comments');
        const commentsResult = await commentsCollection.deleteMany({ creator: username });

        // 3. Update reactions: Remove the user from `usersLiked` and `usersUnliked` arrays and adjust the like/unlike counts
        const reactionsCollection = db.collection('reactions');

        // Step 1: Decrement likes and remove from usersLiked array
        const decrementLikesResult = await reactionsCollection.updateMany(
            { usersLiked: username },
            {
                $inc: { likes: -1 }, // Decrease likes count
                $pull: { usersLiked: username } // Remove the user from usersLiked array
            }
        );

        // Step 2: Decrement unlikes and remove from usersUnliked array
        const decrementUnlikesResult = await reactionsCollection.updateMany(
            { usersUnliked: username },
            {
                $inc: { unlikes: -1 }, // Decrease unlikes count
                $pull: { usersUnliked: username } // Remove the user from usersUnliked array
            }
        );

        // Return results
        return {
            userResult,
            commentsResult,
            reactionsResult: {
                decrementLikesResult,
                decrementUnlikesResult
            }
        };

    } catch (error) {
        console.error('Error deleting user and related data:', error);
        throw new Error('Database delete operation failed');
    }
}


async function userRegister(username, password, nickname) {
    try {
        const collection = db.collection(collectionName);

        // Check if the username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }

        const newUser = {
            username,
            password,
            nickname,
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

async function updateUserProfileImage(username, profileImageName) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.findOneAndUpdate(
            { username },  // Find by username
            { $set: { profile: profileImageName } },  // Update the profile image path
            { returnDocument: 'after' }  // Return the updated document
        );
        return result;  // The updated user document or null if not found
    } catch (error) {
        console.error('Error updating user profile image:', error);
        throw new Error('Database update error');
    }
}
async function uploadVideoFile(videoData) {
    try {
        const collection = db.collection('videos');

        // Find the maximum 'vid' in the collection and calculate the next one
        const maxVidResult = await collection.aggregate([
            {
                $project: {
                    vid: { $toInt: "$vid" }  // Convert vid to integer
                }
            },
            {
                $group: {
                    _id: null,
                    maxVid: { $max: "$vid" }
                }
            }
        ]).toArray();

        // Convert maxVid to integer and increment it
        const nextVid = maxVidResult.length > 0 ? (maxVidResult[0].maxVid + 1).toString() : "1";
        
        // Define the video document to insert with the new 'vid' as an integer
        const videoDocument = {
            title: videoData.title,
            description: videoData.description,
            imageName: videoData.imageName,
            videoFile: videoData.videoFile,
            artist: videoData.artist,
            views: videoData.views || 0,
            date: new Date(videoData.date),
            vid: nextVid,  // Using dynamic vid as an integer
            userId: videoData.userId,
        };

        // Insert the video document into the 'videos' collection
        const result = await collection.insertOne(videoDocument);

        
        

        // Check if the insertion was successful
        if (result.acknowledged) {
            const reactionsCollection = db.collection('reactions');
            
            const reactionDocument = {
                reactionVid: nextVid,   // Use the same 'vid' from the inserted video
                likes: "0",             // Initialize likes to "0"
                unlikes: "0",           // Initialize unlikes to "0"
                userLiked: [],          // Initialize userLiked array to empty
                userUnliked: []         // Initialize userUnliked array to empty
            };

            // Insert the reaction document into the 'reactions' collection
            await reactionsCollection.insertOne(reactionDocument);
            return { success: true, video: videoDocument, insertedId: result.insertedId };
        } else {
            return { success: false, message: 'Failed to insert video document' };
        }
    } catch (error) {
        console.error('Error uploading video to database:', error);
        throw new Error('Database insert error');
    }
}




export default { getUserByUsername, updateUserByUsername, deleteUserByUsername, verifyPassword, userRegister, checkUserAndPass, updateUserProfileImage, uploadVideoFile };
