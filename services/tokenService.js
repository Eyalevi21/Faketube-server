import jwt from 'jsonwebtoken';

const secretKey = 'mySuperSecretKey1234567890!@#';

function generateToken(user) {
    // Create a token with user information and expiry time
    const payload = {
        sub: user.username,     
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}


// Function to verify the token
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);

        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (error) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null,
        };
    }
}

export  { generateToken, verifyToken };
