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
        const id = req.body.id;  // Get username from request body

        // Update user's profile image path in the database
        const user = await userModel.updateUserProfileImage(id, profileImage.filename);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send('Server error');
    }
}

export { getUser, updateUser, deleteUser, createUser, uploadProfileImage };
