const express = require('express');
const authMiddleware = require('../middleware/auth-middleware'); // Import the auth middleware
const adminMiddleware = require('../middleware/admin-middleware'); // Import the admin middleware

const router = express.Router();

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ 
        message: 'Welcome to the Admin Page!' 
    });
});

module.exports = router;