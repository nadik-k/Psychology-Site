const express = require('express');
const router = express.Router();
const { generateDataAndSignature } = require('../liqpay');
const Consultation = require('../models/Consultation');
const { Buffer } = require('buffer');

router.post('/pay', (req, res) => {
    const { amount, description } = req.body;

    const orderId = `order-${Date.now()}`;
    const { data, signature } = generateDataAndSignature({
        amount,
        currency: 'UAH',
        description,
        order_id: orderId,
        action: 'pay',
        version: '3',
        language: 'uk',
        result_url: 'http://localhost:3000/meetings',
        server_url: 'https://b787-176-119-113-136.ngrok-free.app/api/callback',
        sandbox: 1
    });

    res.json({ data, signature });
});

router.post('/callback', async (req, res) => {
    try {
        const { data, signature } = req.body;
        console.log('📩 CALLBACK від LiqPay:', { data, signature });

        const json = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        console.log('📄 LiqPay decoded data:', json);

        if (json.status === 'success' || json.status === 'sandbox') {
            const customInfo = JSON.parse(json.description.match(/{.*}/)?.[0] || '{}');
            const { userId, psychologId, datetime, format } = customInfo;

            await Consultation.create({
                userId,
                psychologId,
                datetime,
                format,
                status: 'paid',
                psychologistStatus: "Очікуйте"
            });

            console.log('✅ Консультацію збережено');
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('❌ Помилка при обробці callback:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;