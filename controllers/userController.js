import userModel from '../models/userModel.js';

async function getUser(req, res) {
    const { id } = req.params;

    try {
        const { token, user } = await userModel.getUserByUsername(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ token, user }); // Send user data back to client
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function createUser(req, res) {
    const { username, password, nickname } = req.body;
    
    try {
        // Call userModel to register the user with the provided data
        const result = await userModel.userRegister(username, password, nickname);
        if (result.success) {
            return res.status(200).json({ success: true, message: result.message });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async function updateUser(req, res) {
    const { id } = req.params;
    const { nickname, profile } = req.body;

    try {
        const updateData = { nickname, profile };
        const result = await userModel.updateUserByUsername(id, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'No changes made' });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const { userResult, commentsResult, reactionsResult } = await userModel.deleteUserByUsername(id);

        if (userResult.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User and related data deleted successfully',
            deletedUser: userResult.deletedCount,
            deletedComments: commentsResult.deletedCount,
            updatedReactions: reactionsResult.modifiedCount
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function uploadProfileImage(req, res) {
    try {
        const profileImage = req.file;  // Multer handles the file
        // Update user's profile image path in the database
        const user = await userModel.updateUserProfileImage(id, profileImage.filename);

        if (user) {
            res.send('Profile image uploaded and saved to MongoDB');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send('Server error');
    }
}

async function uploadVideoFile(req, res) {
    try {
        const { title, description, imageName, artist, views, date } = req.body;  // Extract metadata from request body
        const videoFile = req.file;  // The uploaded video file, handled by Multer

        // Ensure all necessary fields are present
        if (!videoFile || !title || !description || !imageName || !artist || !date) {
            return res.status(400).json({ message: 'Missing required fields: video file or metadata.' });
        }

        // Construct the video data object to store in the database
        const videoData = {
            title,
            description,
            imageName,  // Thumbnail URL provided by the client
            artist,
            views: parseInt(views, 10),  // Ensure views is a number
            date,
            videoFile: videoFile.filename,  // Multer provides the filename of the uploaded video
            userId: req.params.id  // User ID is passed in the URL as :id
        };

        // Call the model function to handle saving the video and metadata to the database
        const result = await userModel.uploadVideoFile(videoData);  // This function will save the data to your database

        if (result.success) {
            return res.status(200).json({ success: true, message: 'Video uploaded successfully', video: result.video });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to upload video' });
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



export { getUser, updateUser, deleteUser, createUser, uploadProfileImage,uploadVideoFile };
