const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    psychologId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
    datetime: { type: Date, required: true },
    format: { type: String, enum: ['Skype', 'Zoom', 'Google Meet'], required: true },
    status: { type: String, default: 'paid' },
    psychologistStatus: { type: String, default: 'wait' }
});

module.exports = mongoose.model('Consultation', consultationSchema, 'Consultation');
