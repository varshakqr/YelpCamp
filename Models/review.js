const mongoose = require('mongoose'); // Import the Mongoose library
const Schema = mongoose.Schema; // Create a Mongoose Schema instance

// Define the schema for storing review data
const reviewSchema = new Schema({
    body: String, // The content of the review
    rating: Number, // The rating given to the reviewed item
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model for the author of the review
    }
});

// Export the Review model using the defined schema
module.exports = mongoose.model('Review', reviewSchema);
