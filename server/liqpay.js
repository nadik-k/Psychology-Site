const crypto = require('crypto');
const { public_key, private_key } = require('./config');

function base64(str) {
    return Buffer.from(str).toString('base64');
}
function sha1(str) {
    return crypto.createHash('sha1').update(str).digest();
}
function signature(str) {
    return base64(sha1(str));
}
function generateDataAndSignature(params) {
    const fullParams = {
        ...params,
        public_key
    };
    const json = JSON.stringify(fullParams);
    const data = base64(json);
    const sign = signature(private_key + data + private_key);
    return { data, signature: sign };
}
module.exports = { generateDataAndSignature };