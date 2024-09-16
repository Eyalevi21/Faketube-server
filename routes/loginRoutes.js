import express from 'express'
import { login } from '../controllers/loginController.js'
import { verifyToken } from '../services/tokenService.js';
const router = express.Router();

router.post('/', login);
router.post('/verify-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = verifyToken(token);
        return res.json({ valid: true, decoded });
    } catch (error) {
        return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
});
export default router;


