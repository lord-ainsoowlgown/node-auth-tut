const express = require('express');
const authMiddleware = require('../middleware/auth-middleware'); // Import the auth middleware

const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {

    const { username, userId, role } = req.userInfo; // Destructure the user info from the request object
    res.json({ 
        message: 'Welcome to the Home Page!',
        user: {
            _id: userId,
            username,
            role
        }
    });
});

module.exports = router;