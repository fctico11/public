import mongoose from 'mongoose';
const mongoose = require('mongoose');

//Schemas
// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
    // username provided by authentication plugin
    // password hash provided by authentication plugin
    //lists below is an example of what will be stored with each individual user
    //lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
  });


// TODO: add remainder of setup for slugs, connection, registering models, etc. below
//Register the schema with mongoose
//mongoose.model('schemaName', schemaName);

console.log(process.env.DSN);
mongoose.connect(process.env.DSN); //connect to database