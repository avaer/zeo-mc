const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const mkdirp = require('mkdirp');
const Authorizer = require('../lib/authorizer');
const config = require('../lib/config').get();
const u = require('../lib/js-utils');

const authorizer = new Authorizer({
  publicKey: config.publicKey,
  privateKey: config.privateKey
});

const SCOPES = ['read', 'write'];
const AUTH_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;
const SALT_SIZE = 8;
const NONCE_SIZE = 8;

class PlayerReader {
  constructor(opts) {
    this.dataDirectory = opts.dataDirectory;
  }

  _createAuth(opts, cb) {
    const name = opts.name;
    const scopes = opts.scopes || SCOPES;

    authorizer.createAuth({
      user: name,
      scopes,
      expires: +new Date() + AUTH_EXPIRY_TIME,
      nonce: _makeNonce()
    }, u.ok(cb, auth => {
      cb(null, {
        data: {
          auth
        },
        contentType: 'application/json'
      });
    }));
  }

  createPlayer(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    const salt = _makeSalt();

    authorizer.getPasswordHash({
      salt,
      password
    }, u.ok(cb, passwordHash => {
      this.setPlayerJson(name, {
        name,
        salt,
        passwordHash
      }, u.ok(cb, player => {
        this._createAuth(name, cb);
      }));
    }));
  }

  login(opts, cb) {
    const name = opts.name;
    const password = opts.password;

    this.getPlayerJson(name, u.ok(cb, user => {
      const salt = user.salt;
      const passwordHash = user.passwordHash;
      authorizer.verifyPasswordHash({salt, passwordHash, password}, u.ok(cb, ok => {
        if (ok) {
          this._createAuth({
            name
          }, cb);
        } else {
          cb(u.error('EAUTH'));
        }
      }));
    }));
  }

  authorize(opts, cb) {
    const name = opts.name;
    const password = opts.password;
    const scopes = opts.scopes;

    // XXX
  }

  getPlayerJson(name, cb) {
    const dataDirectory = this.dataDirectory;
    const playerDirectory = path.join(dataDirectory, 'players', name);
    const playerJsonPath = path.join(playerDirectory, 'index.json');

    fs.readFile(playerJsonPath, 'utf8', u.ok(cb, s => {
      const playerJson = u.jsonParse(s);
      cb(null, {
        data: playerJson,
        contentType: 'application/json'
      });
    }));
  });

  getPlayerJsonFromAuth(opts, cb) {
    const cookie = opts.cookie;
    const auth = authorizer.parseAuth(cookie);

    if (auth && auth.expires < +new Date()) {
      const user = auth.user;
      this.getPlayerJson(user, cb);
    } else {
      cb(u.error('EAUTH'));
    }
  }

  setPlayerJson(name, playerJson, cb) {
    const dataDirectory = this.dataDirectory;
    const playerDirectory = path.join(dataDirectory, 'players', user);

    mkdirp(u.ok(cb, () => {
      const playerJsonPath = path.join(playerDirectory, 'index.json');
      const data = JSON.stringify(playerJson, null, 2);

      fs.writeFile(playerJsonPath, data, cb);
    }));
  }
}

function _makeSalt() {
  return crypto.randomBytes(SALT_SIZE).toString('base64');
}

function _makeNonce() {
  return crypto.randomBytes(NONCE_SIZE).toString('hex');
}

module.exports = PlayerReader;
