const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../Models/campground');
const { isLoggedIn, isAuthor, validateCampgrounds } = require('../middleware');
const campgrounds = require('../controller/campground');
const multer = require('multer')

// Import storage configuration from the cloudinary module
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

// Define routes and their corresponding handlers
router.route('/')
    .get(catchAsync(campgrounds.index)) // Display a list of campgrounds
    .post(isLoggedIn, upload.array('image'), validateCampgrounds, catchAsync(campgrounds.createCampground)); // Create a new campground

router.get('/new', isLoggedIn, campgrounds.renderNewForm); // Display a form for creating a new campground

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // Display details of a specific campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampgrounds, catchAsync(campgrounds.editCampground)) // Update a campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // Delete a campground

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); // Display a form for editing a campground

module.exports = router;
