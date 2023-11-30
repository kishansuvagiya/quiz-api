const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: {type: String, trim: true},
  options: [String],
  answer: {type: String, trim: true},
  category: {type: Schema.Types.ObjectId, ref: "category"},
});

let queData = mongoose.model('questions', quizSchema)

module.exports = queData;