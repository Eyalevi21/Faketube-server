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
    const { username } = req.params;

    try {
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const videos = await videoModel.getVideosByUser(username);

        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching user videos:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function videoData(req, res) {
    try {
        const videoId = req.params.vid; // Get video ID from URL
        console.log(videoId);
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
    const { vid } = req.params.vid;
    const updateData = req.body; // Get update data from the request body

    try {
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

    try {
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


export  { homeVideos, getUserVideos, videoData, updateVideo, deleteVideo};