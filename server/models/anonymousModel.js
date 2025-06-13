const mongoose = require('mongoose');

const anonymousSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        enum: ['anonymous', 'psycholog'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    takenBy: {
        type: String,
        default: null
    },
    isClosed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('AnonymousMessage', anonymousSchema, 'AnonymousMessage');