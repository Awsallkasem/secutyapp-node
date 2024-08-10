const secret = require('../../config/sha1');
const crypto = require('crypto');



//We Use it to generate random key
async function generate_Key(id, phone) {
    return crypto.createHash('sha256', secret).update(`${id}${phone}`).digest('hex');
    // return await (await bcrypt.hash(`${id}${phone}`, 10)).toString('hex');
}
module.exports = generate_Key;