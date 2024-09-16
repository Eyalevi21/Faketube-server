import jwt from 'jsonwebtoken';

const secretKey = 'mySuperSecretKey1234567890!@#';

function generateToken(user) {
    // Create a token with user information and expiry time
    const payload = {
        sub: user.username,     
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export  { generateToken };