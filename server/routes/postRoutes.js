// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    console.log('GET /api/posts — запит отримано');
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Щось пішло не так' });
    }
});

module.exports = router;
