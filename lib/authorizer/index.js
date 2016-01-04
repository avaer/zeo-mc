const config = require('../config/index.js').get();

const SIGNATURE_ALGORITHM = 'RSA-SHA512';

class Authorizer {
  constructor(opts) {
    this.publicKey = opts.publicKey;
    this.privateKey = opts.privateKey;
  }

  makeAuth(auth, cb) {
    const data = JSON.stringify(auth);

    const sign = crypto.createSign(SIGNATURE_ALGORITHM);
    sign.end(data);

    const signature = sign.sign(this.privateKey, 'base64');
    const cookie = data + ':' + signature;

    process.nextTick(() => {
      cb(null, cookie);
    });
  }

  parseAuth(cookie, cb) {
    const match = cookie.match(/^(.+):(.+)$/);
    const data = match[1];
    const signature = match[2];

    const verify = crypto.createVerify(SIGNATURE_ALGORITHM);
    verify.end(data);

    const verified = verify.verify(this.publicKey, signature, 'base64');

    if (verified) {
      const auth = u.jsonParse(data);

      process.nextTick(() => {
        cb(null, auth);
      });
    } else {
      process.nextTick(() => {
       cb(null, null);
      });
    }
  }

  getPasswordHash(opts, cb) {
    // XXX
  }

  verifyPasswordHash(opts, cb) {
    // XXX
  }
}

module.exports = Authorizer;
