const Image = require('../models/Image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { cursorTo } = require('readline');

const uploadImage = async (req, res) => {
    try {

        // Check if file is missing in req object
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image'
            });
        }

        // upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        // store the image url and public id along with the uploaded user id in the database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();

        // delete the file from local storage
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Image uploaded Successfuly!',
            image: newlyUploadedImage
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // current page number
        const limit = parseInt(req.query.limit) || 5; // number of images per page
        const skip = (page - 1) * limit; // number of images to skip

        const sortBy = req.query.sortBy || 'createdAt'; // sort by createdAt by default
        const sortOrder = req.query.sortOrder || 'asc' ? 1 : -1; // sort order (1 for ascending, -1 for descending)

        const totalImages = await Image.countDocuments(); // total number of images in the database
        const totalPages = Math.ceil(totalImages / limit); // total number of pages

        const sortObj = {};
        sortObj[sortBy] = sortOrder; // create sort object

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit); // fetch images from database

        if(images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                message: 'Images fetched successfully!',
                data: images
            });
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

const deleteImageController = async (req, res) => {
    try {
        const getCureentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCureentIdOfImageToBeDeleted);
        if(!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found!'
            });
        }

        // check if the image belongs to the user who is trying to delete it
        if(image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image!'
            });
        }

        // delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete the image from database
        await Image.findByIdAndDelete(getCureentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully!'
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController
}