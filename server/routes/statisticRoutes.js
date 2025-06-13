const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const User = require('../models/User');

router.get('/statistics', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeToday = await User.countDocuments({ lastActive: { $gte: new Date().setHours(0, 0, 0, 0) } });

        const completed = await Consultation.countDocuments({ status: 'completed' });
        const scheduled = await Consultation.countDocuments({ status: 'scheduled' });
        const cancelled = await Consultation.countDocuments({ status: 'cancelled' });

        const testCount = await TestResult.countDocuments();
        const topTest = await TestResult.aggregate([
            { $group: { _id: '$testName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const diaryEntries = await Diary.countDocuments();

        // Дані по дням тижня (приклад)
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        const trends = await Promise.all(
            last7Days.map(async (day) => {
                const start = new Date(`${day}T00:00:00.000Z`);
                const end = new Date(`${day}T23:59:59.999Z`);
                const count = await Consultation.countDocuments({
                    status: 'completed',
                    date: { $gte: start, $lte: end },
                });
                return { name: day, consultations: count };
            })
        );

        res.json({
            users: { total: totalUsers, activeToday },
            consultations: { completed, scheduled, cancelled },
            tests: {
                taken: testCount,
                mostPopular: topTest[0]?._id || 'Немає даних',
            },
            diary: { entries: diaryEntries },
            anonymous: { requests: 0 }, // можна додати справжню логіку
            trends,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

module.exports = router;
