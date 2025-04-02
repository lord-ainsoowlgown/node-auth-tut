const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

// all routes are related to authentication & authorization
router.post('/register', registerUser); // register route
router.post('/login', loginUser); // login route
router.post('/change-password', authMiddleware, changePassword); // change password route

module.exports = router;