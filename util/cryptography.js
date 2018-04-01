var config = require('./../snakedb/config'),
    crypto = require('crypto');

//http://lollyrock.com/articles/nodejs-encryption/ - encrypt and dedcrypt method
function encrypt(text){
    var cipher = crypto.createCipher(config.cryptoalgorithm,config.secret);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

//random number generator
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

//though the below method is not used, kept if need arise in future
function decrypt(text){
    var decipher = crypto.createDecipher(config.cryptoalgorithm,config.secret);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {encrypt: encrypt, decrypt: decrypt, randomValueHex: randomValueHex};