// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  image: String,
  description: String,
  registrationLink: String
});

module.exports = mongoose.model('Event', eventSchema, 'Event');