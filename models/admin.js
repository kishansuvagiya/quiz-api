const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    fullname: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

let admin = mongoose.model('admin', adminSchema)

module.exports = admin;