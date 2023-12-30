const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: String,
  email: {type:String, unique: true},
  password: String
});

let userData = mongoose.model('user', userSchema)

module.exports = userData;