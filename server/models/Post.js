const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    image: String,
    excerpt: { type: String, required: true },
    fullText: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema, 'Post');
