const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        const sessions = await Consultation.find({ userId })
            .sort({ datetime: 1 })
            .populate('psychologId', 'name');

        res.json(sessions);
    } catch (error) {
        console.error('Помилка при отриманні сесій:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;