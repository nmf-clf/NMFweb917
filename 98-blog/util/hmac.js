//加密和密码加密
const crypto = require('crypto');

// const hash = crypto.createHash('md5'); //安全性低
// const hash = crypto.createHash('sha256');
/*
const hash = crypto.createHash('sha512');
//test 经过md5/sha256加密
hash.update('test');

console.log(hash.digest('hex'));
*/
/*
const hmac = crypto.createHmac('sha256', 'sdjfkdsjfkdsfj2');
hmac.update('test');
console.log(hmac.digest('hex'));
*/

module.exports = (str)=>{
	const hmac = crypto.createHmac('sha256', 'sdjfkdsjfkdsfj2');
	hmac.update(str);
	return hmac.digest('hex');
}
