const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const mkdirp = require('mkdirp');
const keypair = require('keypair');
const u = require('../js-utils/index.js');

const KEYPAIR_BITS = 2048;

const configJson = require('../../config/index.json');
const config = u.extend(configJson, {
  publicKey: null,
  privateKey: null
});

const api = {
  bootstrap: cb => {
    api._getInitialization(u.ok(cb, initialization => {
      if (initialization) {
        _latchInitialization(initialization);

        cb();
      } else {
        api._setInitialization(u.ok(cb, initialization => {
          _latchInitialization(initialization);

          cb();
        }));
      }
    }));
  },

  _getInitialization: cb => {
    const dataDirectory = configJson.dataDirectory;

    u.parallel(() => {
      const publicKeyPath = path.join(dataDirectory, 'data', 'keys', 'public.pem');

      fs.readFile(publicKeyPath, 'utf8', cb);
    }, () => {
      const privateKeyPath = path.join(dataDirectory, 'data', 'keys', 'private.pem');

      fs.readFile(privateKeyPath, 'utf8', cb);
    }, u.ok(err => {
      if (err.code === 'ENOENT') {
        cb(null, null);
      } else {
        cb(err);
      }
    }, results => {
      const publicKey = results[0];
      const privateKey = results[1];

      cb(null, {
        publicKey,
        privateKey
      });
    }));
  },

  _setInitialization: cb => {
    const keys = keypair({
      bits: KEYPAIR_BITS
    });
    const publicKey = keys.public;
    const privateKey = keys.private;

    const dataDirectory = configJson.dataDirectory;
    const keysDirectory = path.join(dataDirectory, 'data', 'keys');

    mkdirp(keysDirectory, u.ok(cb, () => {
      u.parallel(() => {
        const publicKeyPath = path.join(keysDirectory, 'public.pem');
        fs.writeFile(publicKeyPath, publicKey, cb);
      }, () => {
        const privateKeyPath = path.join(keysDirectory, 'private.pem');
        fs.writeFile(privateKeyPath, privateKey, cb);
      }, u.ok(cb, results => {
        const publicKey = results[0];
        const privateKey = results[1];

        cb(null, {
          publicKey,
          privateKey
        });
      }));
    }));
  },

  get: () => {
    return config;
  }
};

function _latchInitialization(initialization) {
  config.publicKey = initialization.publicKey;
  config.privateKey = initialization.privateKey;
}

module.exports = api;
