import regModel from '../models/reg.js';

async function register(req, res) {
    const { username, password, nickname, profile } = req.body;
    try {
        if (!profile) {
            return res.status(400).json({ success: false, message: 'Profile picture is required' });
        }

        

        const result = await regModel.registerUser(username, password, nickname, profile);
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

export { register };
