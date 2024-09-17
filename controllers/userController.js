import userModel from '../models/userModel.js';

async function getUser(req, res) {
    const { id } = req.params;

    try {
        const { token, user }  = await userModel.getUserByUsername(id);
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
    const { username, password, nickname, profile } = req.body;
    try {
        if (!profile) {
            return res.status(400).json({ success: false, message: 'Profile picture is required' });
        }

        const result = await userModel.userRegister(username, password, nickname, profile);
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
        const result = await userModel.deleteUserByUsername(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { getUser, updateUser, deleteUser, createUser };
