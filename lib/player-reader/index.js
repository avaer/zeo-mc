const path = require('path');
const fs = require('fs');

const u = require('../lib/js-utils');

const SCOPES = ['read', 'write'];
const AUTH_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

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

  _makeAuth(opts, cb) {
    // XXX
  }

  create(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    this.readUser({name}, u.ok(cb, user => {
      this._makeAuth({
        user: name,
        scopes: SCOPES,
        expires: +new Date() + AUTH_EXPIRY_TIME
      }, cb);
    }));
  }

  login(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    this._readLocalUser({name}, u.ok(cb, user => {
      const salt = user.salt;
      if (_checkPassword({salt, hash, password})) {
        this._makeAuth({
          user: user,
          scopes: SCOPES,
          expires: +new Date() + AUTH_EXPIRY_TIME
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

  parse(opts, cb) {
    const cookie = opts.cookie;
    const auth = this._parseAuth(cookie);;

    if (auth) {
      // XXX
    } else {
      cb(u.error('EAUTH'));
    }
  }
}

module.exports = PlayerReader;
