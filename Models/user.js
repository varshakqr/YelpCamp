// Import necessary modules
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define a user schema using mongoose.Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,         // The 'email' field is of type String
        required: true,       // It is a required field, meaning it must be provided when creating a user
        unique: true          // It must be unique, ensuring that no two users can have the same email
    }
})

// Plugin Passport-Local Mongoose to the user schema
userSchema.plugin(passportLocalMongoose);

// Create and export the User model using the user schema
module.exports = mongoose.model('User', userSchema);
