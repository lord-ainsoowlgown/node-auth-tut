const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register controller
const registerUser = async (req, res) => {
    try {
        // extract User information from our request body
        const { username, email, password, role } = req.body;

        // check if user already exists in our database
        const checkExistingUSer = await User.findOne({$or: [{username}, {email}]});
        if (checkExistingUSer) {
            return res.status(400).json({
                success: false,
                message: 'User already exists! Please login',
            });
        }

        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user in our database and savein your database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // default role is user
        });

        await newlyCreatedUser.save();

        if(newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully!',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Unable to register user! Please try again.',
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again',
        });
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if user exists in our database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials!',
            });
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials!',
            });
        }

        // Create user token
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m' // token will expire in 15 minutes
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully!',
            accessToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again',
         });
    }
}

module.exports = { registerUser, loginUser };