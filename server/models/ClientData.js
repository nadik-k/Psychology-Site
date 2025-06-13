const mongoose = require('mongoose');

const clientDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

module.exports = mongoose.model('ClientData', clientDataSchema, 'ClientData');
