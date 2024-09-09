import homeVideosModel from '../models/homevideos.js';

async function homevideoview(req, res) {
    try {
        // Fetch videos from the model
        const videos = await homeVideosModel.getAllVideos();
        
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

export  { homevideoview };
