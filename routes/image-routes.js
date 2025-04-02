const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const { uploadImage, fetchImagesController, deleteImageController } = require('../controllers/image-controller');

const router = express.Router();

// upload an image
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage);
router .get('/get', authMiddleware, fetchImagesController); // Fetch all images
router .get('/delete/:id', authMiddleware, adminMiddleware, deleteImageController); // delete image

// To get all the images

module.exports = router;