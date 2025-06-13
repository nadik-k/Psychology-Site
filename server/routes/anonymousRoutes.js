const express = require('express');
const router = express.Router();
const { JWT_SECRET } = require('../config');
const AnonymousMessage = require('../models/anonymousModel');

// POST: Надіслати анонімне повідомлення
router.post('/', async (req, res) => {
    try {
        const { text, sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'sessionId обовʼязковий' });

        const authHeader = req.headers.authorization;
        let sender = 'anonymous';

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const authToken = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(authToken, JWT_SECRET);
                if (decoded.role === 'psycholog') {
                    sender = 'psycholog';
                }
            } catch (err) {
                return res.status(401).json({ error: 'Недійсний токен' });
            }
        }

        const saved = await new AnonymousMessage({ text, sessionId, sender }).save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Помилка збереження повідомлення' });
    }
});

// GET: Отримати всі анонімні повідомлення (для адміністратора)
router.get('/', async (req, res) => {
    try {
        const messages = await AnonymousMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Помилка отримання повідомлень' });
    }
});

router.get('/messages/:sessionId', async (req, res) => {
    try {
        const messages = await AnonymousMessage.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при завантаженні повідомлень' });
    }
});

router.get('/req', async (req, res) => {
    try {
        const all = await AnonymousMessage.find({ takenBy: null }).sort({ createdAt: 1 });

        const unique = new Map();
        all.forEach(msg => {
            if (!unique.has(msg.sessionId)) {
                unique.set(msg.sessionId, msg);
            }
        });

        res.json(Array.from(unique.values()));
    } catch (err) {
        res.status(500).json({ error: 'Помилка отримання повідомлень' });
    }
});

// PATCH: Психолог бере запит
router.patch('/take/:sessionId', async (req, res) => {
    try {
        const { userId } = req.body;
        const sessionId = req.params.sessionId;

        const existingMessage = await AnonymousMessage.findOne({ sessionId });

        if (!existingMessage) {
            return res.status(404).json({ error: "Звернення не знайдено" });
        }

        // Вже зайнято іншим психологом
        if (existingMessage.takenBy && existingMessage.takenBy !== userId) {
            return res.status(409).json({ error: "Звернення вже зайняте іншим психологом" });
        }

        // Якщо вже взято цим психологом – нічого не змінюємо, але повертаємо success
        if (existingMessage.takenBy === userId) {
            return res.json({ success: true });
        }

        // Взяти в роботу
        existingMessage.takenBy = userId;
        await existingMessage.save();

        res.json({ success: true });
    } catch (err) {
        console.error("Помилка взяття звернення:", err);
        res.status(500).json({ error: "Серверна помилка" });
    }
});

// GET: Отримати звернення, які взяв конкретний психолог
router.get('/taken/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const messages = await AnonymousMessage.find({ takenBy: userId }).sort({ createdAt: 1 });

        const unique = new Map();
        messages.forEach(msg => {
            if (!unique.has(msg.sessionId)) {
                unique.set(msg.sessionId, msg);
            }
        });

        res.json(Array.from(unique.values()));
    } catch (err) {
        res.status(500).json({ error: 'Помилка отримання зайнятих звернень' });
    }
});

router.post('/close/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        // оновлюємо всі повідомлення цієї сесії, ставимо isClosed
        await AnonymousMessage.deleteMany({ sessionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка при завершенні сесії' });
    }
});

router.get('/status/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const messageCount = await AnonymousMessage.countDocuments({ sessionId });
        const isClosed = messageCount === 0;

        res.status(200).json({ isClosed });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при перевірці статусу сесії' });
    }
});


module.exports = router;