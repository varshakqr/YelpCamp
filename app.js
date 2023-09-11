if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const mongodbStore = require('connect-mongo');

const User = require('./Models/user');
const ExpressError = require('./utilities/ExpressError');
const userRoutes = require('./routes/user');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.set('strictQuery', false);

main().catch(err => console.log("Error"));

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to Database");
}
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));

const store = mongodbStore.create({
    mongoUrl: dbUrl,
    secret: 'thisismysecret',
    touchAfter: 24 * 3600
})

store.on("error", function(e) {
    console.log("Session Store Error", e);
})
const secret = process.env.SECRET || 'thisismysecret';

app.use(session({
    store,
    name: 'sess',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fakeregister', async(req, res) => {
    const user = new User({
        email: 'abcd@123',
        username: 'hailey'
    })
    const newUser = await User.register(user, 'hello');
    res.send(newUser);
})


app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found"), 404);
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went Wrong";
    res.status(statusCode).render('Error', { err });
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening to port number 3000");
})