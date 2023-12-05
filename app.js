const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const PlantRouter = require('./plantRouter'); 
const { User } = require('./db'); 
const passport = require('./config'); 
const flash = require('connect-flash');
const hbs = require('hbs');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// Middleware configuration
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
}));

//initiaize passport and restore authentification state, if any from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// middleware to add user info to the locals of the view engine
app.use((req, res, next) => {
  res.locals.user = req.isAuthenticated() ? req.user : null; //make user available in all views
  next();
});

// Rgister a Handlebars helper for date formatting
hbs.registerHelper('dateFormat', (value, formatString) => {
  //convert the UTC date to the same timezone 
  const date = new Date(value);
  const zonedDate = utcToZonedTime(date, 'UTC');
  return format(zonedDate, formatString, { timeZone: 'UTC' });
});


//Vieew engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//Static files folder
app.use(express.static('public'));

//home route redirects to login if not authenticated
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/plants'); 
  } else {
    res.render('login', { hasErrors: req.flash('error').length > 0, messages: req.flash('error') });
  }
});

//Register route redirects to register page
app.get('/create-account', (req, res) => {
  res.render('register', { hasErrors: req.flash('error').length > 0, messages: req.flash('error') });
});


//Login POST route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/plants',
  failureRedirect: '/',
  failureFlash: true
}));

//Login route to display the login form
app.get('/login', (req, res) => {
  // check if the user is already authenticated
  if (req.isAuthenticated()) {
    res.redirect('/plants'); //Redirect to the plants page if the user is already logged in
  } else {
    res.render('login', { 
      hasErrors: req.flash('error').length > 0, 
      messages: req.flash('error')
    });
  }
});

//register POST route
app.post('/register', async (req, res) => {
  const { username, password } = req.body; 
  const user = new User({ username });

  try {
    //register method provided by passport-local-mongoose to handle user registration
    User.register(user, password, (err, account) => {
      if (err) {
        // andle the error if the user could not be registered
        req.flash('error', err.message); //use flash to send error message back 
        return res.redirect('/create-account'); //redirect back so user can try again
      }

      req.login(account, (err) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/create-account');
        }
        return res.redirect('/plants'); //redirect to a page that requires authentication
      });
    });
  } catch (error) {
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

