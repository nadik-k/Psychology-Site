const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, message, timestamp } = req.body;
        const newMessage = new Message({ senderId, receiverId, message, timestamp });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при збереженні повідомлення' });
    }
});

router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
        $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
        ]
    }).sort('timestamp');

    res.json(messages);
});

// PUT /api/messages/read/:senderId
router.put('/read/:senderId', async (req, res) => {
    const { readerId } = req.body;
    const { senderId } = req.params;

    try {
        await Message.updateMany(
            { senderId: senderId, receiverId: readerId, read: false },
            { $set: { read: true } }
        );
        res.status(200).send('Messages marked as read');
    } catch (err) {
        res.status(500).send('Error updating messages');
    }
});


module.exports = router;