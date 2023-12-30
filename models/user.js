const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type:String,
    lowercase: true
  },
  email: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: String
});

let userData = mongoose.model('user', userSchema)

module.exports = userData;