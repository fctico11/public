const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const PlantRouter = require('./plantRouter'); // Update the import path as needed
const { User } = require('./db'); // Update the import path as needed
const passport = require('./config'); // Update the import path as needed
const flash = require('connect-flash');
const hbs = require('hbs');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const path = require('path');

const app = express();

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET, // Use the SESSION_SECRET from your .env file
  resave: false,
  saveUninitialized: true,
}));

//initiaize passport and restore authentification state, if any from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware to add user info to the locals of the view engine
app.use((req, res, next) => {
  res.locals.user = req.isAuthenticated() ? req.user : null; // Make user available in all views
  next();
});

// Register a Handlebars helper for date formatting
hbs.registerHelper('dateFormat', (value, formatString) => {
  // Convert the UTC date to the same timezone to avoid shifting the day
  const date = new Date(value);
  const zonedDate = utcToZonedTime(date, 'UTC');
  return format(zonedDate, formatString, { timeZone: 'UTC' });
});


// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files folder
app.use(express.static('public'));

// Home route redirects to login if not authenticated
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/plants'); // Or wherever you want authenticated users to go
  } else {
    res.render('login', { hasErrors: req.flash('error').length > 0, messages: req.flash('error') });
  }
});

// Register route redirects to register page
app.get('/create-account', (req, res) => {
  res.render('register', { hasErrors: req.flash('error').length > 0, messages: req.flash('error') });
});


// Login POST route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/plants',
  failureRedirect: '/',
  failureFlash: true
}));

// Login route to display the login form
app.get('/login', (req, res) => {
  // Check if the user is already authenticated
  if (req.isAuthenticated()) {
    res.redirect('/plants'); // Redirect to the plants page if the user is already logged in
  } else {
    // Render the login page with any flash messages if they exist
    res.render('login', { 
      hasErrors: req.flash('error').length > 0, 
      messages: req.flash('error')
    });
  }
});


// Register POST route
app.post('/register', async (req, res) => {
  const { username, password } = req.body; // Assuming your form will send these fields
  const user = new User({ username });

  try {
    // Use 'register' method provided by passport-local-mongoose to handle user registration
    User.register(user, password, (err, account) => {
      if (err) {
        // Handle the error if the user could not be registered, perhaps due to a duplicate username
        req.flash('error', err.message); // Use flash to send error message back to register form
        return res.redirect('/create-account'); // Redirect back to registration page so user can try again
      }

      // After registration, you may want to automatically log in the user or redirect to login page
      // For this example, let's log in the user directly
      req.login(account, (err) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/create-account');
        }
        return res.redirect('/plants'); // Redirect to a page that requires authentication
      });
    });
  } catch (error) {
    // Handle any other errors
    req.flash('error', error.message);
    res.redirect('/create-account');
  }
});


// Other routes
app.use('/plants', PlantRouter);


// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



module.exports = app;

