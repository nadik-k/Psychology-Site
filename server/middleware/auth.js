const jwt = require('jsonwebtoken');
const JWT_SECRET = 'superSecretKey123';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Не авторизовано' });
    }

    const authToken = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Недійсний токен' });
    }
};
