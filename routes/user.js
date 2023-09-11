const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const { checkReturnTo } = require('../middleware');
const users = require('../controller/user');

// Define routes and their corresponding handlers for user authentication
router.route('/register')
    .get(users.renderRegister) // Display the registration form
    .post(catchAsync(users.register)); // Handle user registration

router.route('/login')
    .get(users.renderLogin) // Display the login form
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login); // Handle user login

router.get('/logout', users.logout); // Handle user logout

module.exports = router;
