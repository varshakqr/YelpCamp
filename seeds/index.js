const mongoose = require('mongoose');
const Campground = require('../Models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

// Disable strict query mode to allow more flexible querying
mongoose.set('strictQuery', false);

// Function to connect to the database and seed it
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'); // Connect to the MongoDB database
    console.log("Connected to Database");
}

// Helper function to select a random item from an array
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

// Function to seed the database with campground data
const seedDb = async () => {
    await Campground.deleteMany({}); // Delete all existing campgrounds from the database

    for (let i = 0; i < 300; i++) {
        let random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63d79281667e0fedf96e4ded', 
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [`${cities[random1000].longitude}`, `${cities[random1000].latitude}`]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275574/YelCamp/xss2hv9am5yeap6ufcse.jpg',
                    filename: 'YelCamp/xss2hv9am5yeap6ufcse'
                },
                {
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275573/YelCamp/ib9dkfqdt7juo2n1ifd8.jpg',
                    filename: 'YelCamp/ib9dkfqdt7juo2n1ifd8'
                },
                {
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275574/YelCamp/zcqdezp7uxxauepyfrrf.jpg',
                    filename: 'YelCamp/zcqdezp7uxxauepyfrrf'
                }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae voluptas ab delectus dolorum, minus molestiae quia nam sequi nostrum odit dolores id alias consequuntur molestias eveniet consectetur neque ea! Officia?',
            price
        });
        await camp.save(); // Save the newly created campground to the database
    }
}

// Call the seedDb function to seed the database with campground data
seedDb()
    .then(() => {
        mongoose.connection.close(); // Close the database connection when seeding is done
    })
    .catch(err => {
        console.log(err);
    });
