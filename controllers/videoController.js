import videoModel from '../models/videoModel.js';
import userModel from '../models/userModel.js';

async function homeVideos(req, res) {
    try {
        // Fetch videos from the model
        const videos = await videoModel.getAllVideos();

        // Check if any videos are found
        if (videos.length > 0) {
            res.json(videos); // Send videos as JSON response
        } else {
            res.status(404).json({ message: 'No videos found' });
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getUserVideos(req, res) {
    const { id } = req.params;

    try {
        const user = await userModel.getUserByUsername(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const videos = await videoModel.getVideosByUser(id);

        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching user videos:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function videoData(req, res) {
    try {
        const videoId = req.params.vid; // Get video VID from URL
        // Fetch video from the model
        const video = await videoModel.getVideo(videoId);

        // Check if video are found
        if (video) {
            res.json(video); // Send video as JSON response
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateVideo(req, res) {
    const { vid } = req.params;
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Fetch the video to check if the user is the owner
        const video = await videoModel.getVideo(vid);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if the user (id) is the artist/owner of the video
        if (video.artist !== id) {
            return res.status(403).json({ message: 'You are not authorized to update this video' });
        }

        // Proceed with updating the video
        const result = await videoModel.updateVideoByVid(vid, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }
        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'No changes made to the video' });
        }

        return res.status(200).json({ message: 'Video updated successfully' });
    } catch (error) {
        console.error('Error updating video:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteVideo(req, res) {
    const { vid } = req.params;
    const { id } = req.params;

    try {
        // Fetch the video to check if the user is the owner
        const video = await videoModel.getVideo(vid);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if the user (id) is the artist/owner of the video
        if (video.artist !== id) {
            return res.status(403).json({ message: 'You are not authorized to delete this video' });
        }

        // Proceed with deleting the video
        const result = await videoModel.deleteVideoByVid(vid);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getComments(req, res) {
    const { vid } = req.params;

    try {
        const comments = await videoModel.getVideoComments(vid);

        if (!comments || comments.length === 0) {
            return res.status(200).json({ message: 'No comments found for this video' });
        }

        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getReactions(req, res) {
    const { vid } = req.params; // Get the video ID from the request params

    try {
        const reactions = await videoModel.getVideoReactions(vid); // Fetch reactions using the model
        if (reactions) {
            res.status(200).json(reactions); // Return reactions data if found
        } else {
            res.status(404).json({ message: 'No reactions found for this video' });
        }
    } catch (error) {
        console.error('Error fetching reactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateReactions(req, res) {
    const { vid } = req.params;
    const { currentReaction, newReaction } = req.body;

    try {
        // Call the model function to update reactions
        const updatedReactions = await videoModel.updateVideoReactions(vid, currentReaction, newReaction);

        if (updatedReactions) {
            // Send back the updated likes and unlikes
            res.status(200).json({
                likes: updatedReactions.likes,
                unlikes: updatedReactions.unlikes,
            });
        } else {
            res.status(404).json({ message: 'Video reactions not found' });
        }
    } catch (error) {
        console.error('Error updating reactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function addComment(req, res) {
    const { vid } = req.params;
    const { creator, content } = req.body;

    try {
        const newComment = {
            commentVid: vid,
            creator: creator,
            content: content,
        };

        const result = await videoModel.addComment(newComment);
        if (result.insertedId) {
            newComment._id = result.insertedId;
            res.status(201).json(newComment);
        } else {
            res.status(500).json({ message: 'Failed to add comment' });
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export { homeVideos, getUserVideos, videoData, updateVideo, deleteVideo, getComments, addComment, getReactions, updateReactions };