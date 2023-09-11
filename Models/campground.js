const mongoose = require('mongoose'); // Import the Mongoose library
const Review = require('./review'); // Import the Review model
const Schema = mongoose.Schema; // Create a Mongoose Schema instance

// Define the schema for storing image data
const ImageSchema = new Schema({
    url: String, // URL of the image
    filename: String // Filename of the image
});

// Create a virtual property for generating a thumbnail URL
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200'); // Modify the URL to generate a thumbnail
});

// Options for the schema to enable virtuals
const opts = { toJSON: { virtuals: true } };

// Define the campground schema
const campgroundSchema = new Schema({
    title: String, // Title of the campground
    images: [ImageSchema], // Array of images associated with the campground
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // Specify the type as 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of latitude and longitude coordinates
            required: true
        }
    },
    price: Number, // Price of the campground
    description: String, // Description of the campground
    location: String, // Location of the campground
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model for the author of the campground
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' // Reference to the Review model for associated reviews
    }]
}, opts);

// Create a virtual property for generating HTML markup with a link to the campground
campgroundSchema.virtual('properties.popMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`; // Generate HTML markup with a link and description
});

// Define a post middleware to remove associated reviews when a campground is deleted
campgroundSchema.post('findOneAndDelete', async function(camp) {
    if (camp.reviews) {
        await Review.deleteMany({
            _id: { $in: camp.reviews }
        });
    }
});

// Export the Campground model using the defined schema
module.exports = mongoose.model('Campground', campgroundSchema);
