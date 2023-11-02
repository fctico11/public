import express from 'express';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import './db.mjs';

const app = express();

//retrieve the model registered with mongoose
import mongoose from 'mongoose';
//const Review = mongoose.model('Review');

//set up express statiic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// enable sessions with middleware to manage session data
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

app.listen(process.env.PORT ?? 3000);
