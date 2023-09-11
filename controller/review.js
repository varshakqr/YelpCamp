// Import required models
const Campground = require('../Models/campground'); // Import the Campground model
const Review = require('../Models/review'); // Import the Review model

// Route handler to create a new review
module.exports.createReview = async (req, res, next) => {
    // Find the campground by its ID using the parameter from the request
    const campground = await Campground.findById(req.params.id);

    // Create a new Review instance with data from the request body
    const review = new Review(req.body.review);

    // Set the author of the review to the current user's ID
    review.author = req.user._id;

    // Add the new review to the campground's list of reviews
    campground.reviews.push(review);

    // Save the new review and update the campground's reviews array
    await review.save();
    await campground.save();

    // Flash a success message and redirect to the campground's show page
    req.flash('success', 'Successfully added a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Route handler to delete a review
module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Find the campground by its ID and remove the specified review from its reviews array
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Find and delete the review by its ID
    await Review.findByIdAndDelete(reviewId);

    // Flash a success message and redirect to the campground's show page
    req.flash('success', 'Successfully deleted a Review!!!!');
    res.redirect(`/campgrounds/${id}`);
}
