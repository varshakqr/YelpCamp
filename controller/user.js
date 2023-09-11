// Import the User model
const User = require('../Models/user');

// Route handler to render the registration form
module.exports.renderRegister = async (req, res) => {
    res.render('users/register'); // Render the registration form
}

// Route handler to process user registration
module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new User instance with provided username and email
        const user = new User({ username, email });

        // Register the user with the provided password using Passport's `register` method
        const registeredUser = await User.register(user, password);

        // Log in the registered user and redirect to the campgrounds page
        req.login(registeredUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!!!'); // Flash a success message
            res.redirect('/campgrounds'); // Redirect to the campgrounds page
        });
    } catch (e) {
        req.flash('error', e.message); // Flash an error message if registration fails
        res.redirect('/register'); // Redirect back to the registration page
    }
}

// Route handler to render the login form
module.exports.renderLogin = (req, res) => {
    res.render('users/login'); // Render the login form
}

// Route handler for user login
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!'); // Flash a success message upon successful login
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // Determine the redirect URL
    res.redirect(redirectUrl); // Redirect the user to the determined URL
}

// Route handler for user logout
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); } // Handle any potential errors during logout
        req.flash('success', "Successfully Logged Out"); // Flash a success message upon logout
        res.redirect('/campgrounds'); // Redirect to the campgrounds page after logout
    });
}
