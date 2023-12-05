const dotenv = require('dotenv');
dotenv.config(); //execute the dotenv config right away to ensure env variables are loaded

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db').User; 

//config the local strategy for use by passport using async/await
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      //hash instead of pw
      user.authenticate(password, (err, user, passwordErr) => {
        if (err) return done(err);
        if (passwordErr) return done(null, false, { message: 'Incorrect password.' });
        if (user) return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
));

//serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports =  passport;

