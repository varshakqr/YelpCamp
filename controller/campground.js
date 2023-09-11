// Import required modules
const Campground = require('../Models/campground'); // Import the Campground model
const { cloudinary } = require('../cloudinary'); // Import the Cloudinary instance
const mpbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Import Mapbox Geocoding service
const mapboxToken = process.env.MAPBOX_TOKEN; // Retrieve Mapbox token from environment variables
const geocoder = mpbxGeocoding({ accessToken: mapboxToken }); // Initialize Mapbox Geocoding service with the token

// Index route handler to display a list of campgrounds
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({}); // Retrieve all campgrounds from the database
    res.render('campgrounds/index', { campgrounds }); // Render the campground index page with the retrieved data
}

// Route handler to render the form for creating a new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new'); // Render the new campground form
}

// Route handler to create a new campground
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send(); // Use Mapbox Geocoding to convert the location into geographic coordinates
    const camp = new Campground(req.body.campground); // Create a new campground with data from the request body
    camp.geometry = geoData.body.features[0].geometry; // Set the geographic coordinates for the campground
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // Map uploaded images to campground images
    camp.author = req.user._id; // Set the author of the campground to the current user's ID
    await camp.save(); // Save the new campground to the database
    req.flash('success', 'Successfully added a new Campground'); // Flash a success message
    res.redirect('/campgrounds'); // Redirect to the campground index page
}

// Route handler to show a single campground
module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params; // Get the campground ID from the request parameters
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author'); // Retrieve the campground by ID and populate its reviews and author
    if (!campground) {
        req.flash('error', 'Cannot find the Campground!!!!'); // Flash an error message if the campground is not found
        res.redirect('/campgrounds'); // Redirect to the campground index page
    }
    res.render('campgrounds/show', { campground }); // Render the campground show page with the retrieved data
}

// Route handler to render the form for editing a campground
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params; // Get the campground ID from the request parameters
    const campground = await Campground.findById(id); // Retrieve the campground by ID
    if (!campground) {
        req.flash('error', 'Cannot find the Campground'); // Flash an error message if the campground is not found
        res.redirect('/campgrounds'); // Redirect to the campground index page
    }
    console.log(campground.images);
    res.render('campgrounds/edit', { campground }); // Render the campground edit form with the retrieved data
}

// Route handler to edit a campground
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params; // Get the campground ID from the request parameters
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true }); // Update the campground with the data from the request body
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); // Map uploaded images to campground images
    campground.images.push(...imgs); // Add new images to the campground
    await campground.save(); // Save the updated campground
    if (req.body.deleteImgs) {
        for (let filename of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(filename); // Delete images from Cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImgs } } } }); // Remove deleted images from the campground
    }
    req.flash('success', 'Updated Successfully!!!!'); // Flash a success message
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to the updated campground's show page
}

// Route handler to delete a campground
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params; // Get the campground ID from the request parameters
    const campground = await Campground.findByIdAndDelete(id); // Delete the campground by ID
    req.flash('success', 'Successfully deleted Campground!!!!'); // Flash a success message
    res.redirect('/campgrounds'); // Redirect to the campground index page
}
