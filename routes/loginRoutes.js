import express from 'express'
import { login } from '../controllers/loginController.js'
import { verifyToken } from '../services/tokenService.js';
const router = express.Router();

router.post('/', login);
router.get('/verify-token', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(400).json({ message: 'Authorization header is required' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    const verificationResult = verifyToken(token);

    if (verificationResult.valid) {
        return res.json({ valid: true, decoded: verificationResult.decoded });
    } else if (verificationResult.expired) {
        return res.status(401).json({ valid: false, message: 'Token has expired' });
    } else {
        return res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});
export default router;


