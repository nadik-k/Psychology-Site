const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    psychologId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    experience: String,
    photo: String,
    topics: [String],
    price: String,
});

module.exports = mongoose.model('Card', cardSchema, 'Psychologists');