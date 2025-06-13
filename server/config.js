require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    public_key: process.env.PUBLIC_KEY,
    private_key: process.env.PRIVATE_KEY,
};