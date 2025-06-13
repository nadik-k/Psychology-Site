const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dihajvilno@gmail.com',
            pass: 'kehd vvek oxmu vsbj'
        }
    });

    const mailOptions = {
        from: email,
        to: 'dihajvilno@gmail.com',
        subject: `Нове повідомлення з сайту від ${name}`,
        text: `Email: ${email}\n\nПовідомлення:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Лист надіслано!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка надсилання' });
    }
});

module.exports = router;