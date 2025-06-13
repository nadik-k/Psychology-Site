const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const authenticateToken = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Psychologist = require('../models/Card');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });
router.get('/profile', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPassword(password) {
    return password.length >= 6;
}

router.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        gender,
        birthdate,
        email,
        password,
        role,
        photo,
        experience,
        topics,
        price
    } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Невірний формат email' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Пароль повинен містити щонайменше 6 символів' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            gender,
            birthdate,
            email,
            password: hashedPassword,
            role,
            photo: photo ? photo : undefined,
            createdAt: new Date().toISOString(),
            experience: role === 'psycholog' ? experience : undefined,
            topics: role === 'psycholog' ? topics : [],
            price: role === 'psycholog' ? price : undefined
        });
        const name = firstName + " " + lastName
        if (role === 'psycholog') {
            const newPsychologist = new Psychologist({
                userId: newUser._id,
                name: name,
                experience,
                photo,
                topics,
                price
            });
            console.log("It's good!")
            await newPsychologist.save();
        }
        await newUser.save();

        const authToken = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ authToken });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, photo: user.photo },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                photo: user.photo,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Помилка сервера при вході' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
        res.json(user);
    } catch (err) {
        console.error('Помилка отримання користувача:', err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.put('/update', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            birthdate,
            email,
            password,
        } = req.body;

        const name = firstName + " " + lastName
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email: email });
            if (emailExists) {
                return res.status(400).json({ message: 'Цей email вже зайнятий іншим користувачем' });
            }
            user.email = email;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (birthdate) user.birthdate = birthdate;

        if (req.file) {
            user.photo = `/uploads/${req.file.filename}`;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await Psychologist.updateOne({ name: name }, { photo: user.photo });
        await user.save();

        const updatedToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                photo: user.photo
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Профіль оновлено',
            user,
            token: updatedToken
        });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Помилка при оновленні профілю' });
    }
});

router.get('/chat-partners/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oppositeRole = user.role === 'client' ? 'psychologist' : 'client';
    const users = await User.find({ role: oppositeRole });
    res.json(users);
});

module.exports = router;