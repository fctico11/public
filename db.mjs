import mongoose from 'mongoose';
const mongoose = require('mongoose');

//Schemas

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const user = new mongoose.Schema({
    // username provided by authentication plugin
    username: {type: String, required: true, unique: true},
    // password hash provided by authentication plugin
    hash: {type: String, required: true},
    //lists below is an example of what will be stored with each individual user
    //reference to transactions made by the user
    transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
  });

// transaction Schema
const transaction = new mongoose.Schema({
    // reference to the User
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    cryptocurrency: {type: String, required: true},
    quantity: {type: Number, required: true},
    boughtAtPrice: {type: Number, required: true},
    currentPrice: {type: Number} // this can be updated in real time via the crypto API
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below
//Register the schema with mongoose
const User = mongoose.model('user', userSchema);
const Transaction = mongoose.model('transaction', transactionSchema);
export {user, transaction};

console.log(process.env.DSN);
mongoose.connect(process.env.DSN); //connect to database