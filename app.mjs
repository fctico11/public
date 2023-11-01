import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import './db.mjs';

const app = express();

//retrieve the model registered with mongoose
import mongoose from 'mongoose';
//const Review = mongoose.model('Review');

//set up express statiic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/*
//express session middleware to manage session data
app.use(session({
    secret: 'your_secret_key', //secret is used to sign the session id cookie
    resave: false, //only saves the store if the session was modified
    saveUninitialized: true //new sessions are saved
  }));
  */

app.listen(process.env.PORT || 3000);
