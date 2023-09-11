const express = require('express');
const router = express.Router({ mergeParams: true }); // The 'mergeParams' option merges the parameters from parent and child routers.
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateReviews, isReviewAuthor } = require('../middleware');
const reviews = require('../controller/review');

// Define routes and their corresponding handlers for reviews
router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview)); // Create a new review

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview)); // Delete a review

module.exports = router;
