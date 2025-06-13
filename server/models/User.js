const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    birthdate: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['client', 'psycholog', 'admin'], default: 'client' },
    photo: String,
    createdAt: { type: String },

    experience: String,
    format: String,
    topics: [String],
    price: String,
});

module.exports = mongoose.model('User', userSchema, 'Users');