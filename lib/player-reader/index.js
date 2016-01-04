const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const Authorizer = require('../lib/authorizer');
const config = require('../lib/config').get();
const u = require('../lib/js-utils');

const authorizer = new Authorizer({
  publicKey: config.publicKey,
  privateKey: config.privateKey
});

const SCOPES = ['read', 'write'];
const AUTH_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;
const NONCE_SIZE = 4;

class PlayerReader {
  constructor(opts) {
    this.dataDirectory = opts.dataDirectory;
  }

  _readLocalUser(name, cb) {
    // XXX
  }

  _writeLocalUser(name, cb) {
    // XXX
  }

  _createAuth(opts, cb) {
    // XXX
  }

  create(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    this.readUser({name}, u.ok(cb, user => {
      authorizer.createAuth({
        user: name,
        scopes: SCOPES,
        expires: +new Date() + AUTH_EXPIRY_TIME,
        nonce: _makeNonce()
      }, cb);
    }));
  }

  login(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    this._readLocalUser({name}, u.ok(cb, user => {
      const salt = user.salt;
      if (_checkPassword({salt, hash, password})) {
        authorizer.createAuth({
          user: user,
          scopes: SCOPES,
          expires: +new Date() + AUTH_EXPIRY_TIME,
          nonce: _makeNonce()
        }, cb);
      } else {
        cb(u.error('EAUTH'));
      }
    }));
  }

  authorize(opts, cb) {
    const name = opts.name;
    const password = opts.password;
    const scopes = opts.scopes;
  }

  getUser(opts, cb) {
    const cookie = opts.cookie;
    const auth = authorizer.parseAuth(cookie);

    if (auth) {
      // XXX
    } else {
      cb(u.error('EAUTH'));
    }
  }
}

function _makeNonce() {
  return crypto.randomBytes(NONCE_SIZE).toString('hex');
}

module.exports = PlayerReader;
