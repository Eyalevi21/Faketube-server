import userModel from '../models/userModel.js';

async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Missing username or password');
        }

        // Check user credentials
        const { user, token } = await userModel.getUserByUsername(username);
        if (!user || !userModel.verifyPassword(user, password)) {
            return res.status(401).send('Invalid username or password');
        }
        
        // Send JWT and user details to client
        res.status(200).json({
            token,
            user: {
                username: user.username,
                nickname: user.nickname,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export { login };
