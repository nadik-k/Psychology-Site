const express = require('express');
const router = express.Router();

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { mood, note } = req.body;

  try {
    const entry = new DiaryEntry({ userId, mood, note });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Помилка при збереженні запису' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const entries = await DiaryEntry.find({ userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Помилка при завантаженні записів' });
  }
});

module.exports = router;