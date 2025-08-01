const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, enum: ['happy', 'neutral', 'sad'], required: true },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema, 'DiaryEntry');