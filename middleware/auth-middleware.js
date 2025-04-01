const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied! Please login again.'
        });
    }

    // Decode this token and verify it
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded Token:', decodedTokenInfo);

        req.userInfo = decodedTokenInfo; // Attach the decoded token to the request object

        next();

    } catch(error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Access denied! Please login again.'
        });
    }
    
}

module.exports = authMiddleware;