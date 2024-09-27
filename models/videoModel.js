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

        // Fetch top 10 most viewed videos
        const topViewedVideos = await collection
            .find({})
            .sort({ views: -1 }) // Sort by views in descending order
            .limit(10)
            .toArray();

        // Get the vids of the top 10 most viewed videos
        const topViewedVids = topViewedVideos.map(video => video.vid);

        // Fetch 10 random videos excluding the top 10 most viewed
        const randomVideos = await collection
            .aggregate([
                { $match: { vid: { $nin: topViewedVids } } }, // Exclude top viewed videos
                { $sample: { size: 10 } } // Get 10 random videos
            ])
            .toArray();

        // Combine both lists
        const allVideos = [...topViewedVideos, ...randomVideos];

        return allVideos;
    } catch (error) {
        console.error('Error fetching videos from database:', error);
        throw new Error('Database fetch error');
    }
}
async function getVideosByKey(key) {
    try {
        // Access the 'videos' collection
        const collection = db.collection('videos'); // Assuming 'db' is your MongoDB client and 'videos' is the collection name

        // Perform a case-insensitive search using regex
        const videos = await collection.find({
            title: { $regex: key, $options: 'i' } // Search by video title using regex
        }).toArray(); // Convert the result to an array

        return videos; // Return the found videos
    } catch (error) {
        console.error('Error searching for videos:', error);
        throw error; // Throw error to be handled by the calling function
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

import fs from 'fs';
import path from 'path';

async function deleteVideoByVid(vid) {
    try {
        const videoCollection = db.collection('videos');
        const commentsCollection = db.collection('comments');
        const reactionsCollection = db.collection('reactions');

        // Find the video document to get the file names before deleting
        const video = await videoCollection.findOne({ vid });
        if (!video) {
            throw new Error('Video not found');
        }

        // Paths for the video file and thumbnail
        const projectRoot = process.cwd();
        const videoFilePath = path.join(projectRoot, 'public', 'videofiles', video.videoFile);
        const thumbnailPath = path.join(projectRoot, 'public', 'videoThumbnails', video.imageName);

        // Delete the video file from the filesystem
        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);  // Synchronous file deletion
        } else {
            console.warn(`Video file not found: ${videoFilePath}`);
        }

        // Delete the thumbnail from the filesystem
        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);  // Synchronous file deletion
        } else {
            console.warn(`Thumbnail not found: ${thumbnailPath}`);
        }

        // Delete the video from the database
        const videoDeleteResult = await videoCollection.deleteOne({ vid });
        if (videoDeleteResult.deletedCount === 0) {
            throw new Error('Video not found');
        }

        // Delete all comments associated with the video
        await commentsCollection.deleteMany({ commentVid: vid });

        // Delete all reactions associated with the video
        await reactionsCollection.deleteMany({ reactionVid: vid });

        return { success: true, message: 'Video, files, comments, and reactions deleted successfully' };
    } catch (error) {
        console.error('Error deleting video, files, comments, and reactions:', error);
        throw new Error('Failed to delete video and related data');
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

async function updateVideoReactions(vid, username, newReaction) {
    try {
        const collection = db.collection('reactions');
        const videoReaction = await collection.findOne({ reactionVid: vid });

        if (!videoReaction) {
            return null;
        }

        const alreadyLiked = videoReaction.usersLiked.includes(username);
        const alreadyUnliked = videoReaction.usersUnliked.includes(username);

        let update = {};

        if (newReaction === 'like') {
            if (alreadyLiked) {
                return 'already reacted';
            }

            if (alreadyUnliked) {
                update = {
                    $pull: { usersUnliked: username },
                    $inc: { unlikes: -1 }
                };
            }

            update = {
                ...update,
                $addToSet: { usersLiked: username },
                $inc: { ...update.$inc, likes: 1 }
            };

        } else if (newReaction === 'unlike') {
            if (alreadyUnliked) {
                return 'already reacted'; // User has already unliked
            }

            // If the user has already liked, remove them from likes and decrease count
            if (alreadyLiked) {
                update = {
                    $pull: { usersLiked: username },
                    $inc: { likes: -1 }
                };
            }

            // Ensure we merge the $inc updates for likes and unlikes properly
            update = {
                ...update,
                $addToSet: { usersUnliked: username },
                $inc: { ...update.$inc, unlikes: 1 } // Merging $inc for both likes and unlikes
            };
        }

        const result = await collection.updateOne({ reactionVid: vid }, update);
        if (result.matchedCount === 0) return null;

        // Fetch the updated reaction data
        return await collection.findOne({ reactionVid: vid });
    } catch (error) {
        console.error('Error updating video reactions:', error);
        throw new Error('Database update error');
    }
}



async function getVideoReactions(vid) {
    try {
        const collection = db.collection('reactions');
        const reactions = await collection.findOne({ reactionVid: vid });

        if (reactions) {
            return reactions;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching video reactions:', error);
        throw new Error('Error fetching video reactions');
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


export default { getAllVideos, getVideo, getVideosByUser, updateVideoByVid, deleteVideoByVid, getVideoComments, addComment, getVideoReactions, updateVideoReactions, getVideosByKey };
