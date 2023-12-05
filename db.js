const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

//User Schema
const userSchema = new Schema({

  plants: [{
    type: Schema.Types.ObjectId,
    ref: 'Plant'
  }]
});

userSchema.plugin(passportLocalMongoose);

//Plant Schema
const plantSchema = new Schema({
  nickname: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  lastWatered: {
    type: Date,
    required: true
  },
  nextWateringDue: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

//models created from schemas
const User = mongoose.model('User', userSchema);
const Plant = mongoose.model('Plant', plantSchema);

//Mongo URI
const mongoDB = process.env.DSN;
mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});

//Export models and db
module.exports = { User, Plant, db };