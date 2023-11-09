import { config } from 'dotenv';
config(); // Execute the dotenv config right away to ensure environment variables are loaded

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
//import bcrypt from 'bcryptjs';
import { User } from './db.mjs'; // Assuming your User model is exported from db.mjs

// Configure the local strategy for use by Passport using async/await
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Use the 'hash' field instead of 'password'
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

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;

