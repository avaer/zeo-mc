const path = require('path');
const fs = require('fs');

const mkdirp = require('mkdirp');
const cryptoLib = require('../crypto/index');
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

    u.parallel(cb => {
      const publicKeyPath = path.join(dataDirectory, 'crypto', 'public.pem');
      fs.readFile(publicKeyPath, 'utf8', cb);
    }, cb => {
      const privateKeyPath = path.join(dataDirectory, 'crypto', 'private.pem');
      fs.readFile(privateKeyPath, 'utf8', cb);
    }, cb => {
      const certKeyPath = path.join(dataDirectory, 'crypto', 'cert.pem');
      fs.readFile(certKeyPath, 'utf8', cb);
    }, u.ok(err => {
      if (err.code === 'ENOENT') {
        cb(null, null);
      } else {
        cb(err);
      }
    }, results => {
      const publicKey = results[0];
      const privateKey = results[1];
      const cert = results[2];

      cb(null, {
        publicKey,
        privateKey,
        cert,
      });
    }));
  },

  _setInitialization: cb => {
    const keys = cryptoLib.generateKeys();
    const publicKey = keys.publicKey;
    const privateKey = keys.privateKey;
    const cert = cryptoLib.generateCert(keys);

    const cryptoDirectory = path.join(configJson.dataDirectory, 'crypto');

    mkdirp(cryptoDirectory, u.ok(cb, () => {
      u.parallel(cb => {
        const publicKeyPath = path.join(cryptoDirectory, 'public.pem');
        fs.writeFile(publicKeyPath, publicKey, cb);
      }, cb => {
        const privateKeyPath = path.join(cryptoDirectory, 'private.pem');
        fs.writeFile(privateKeyPath, privateKey, cb);
      }, cb => {
        const certPath = path.join(cryptoDirectory, 'cert.pem');
        fs.writeFile(certPath, cert, cb);
      }, u.ok(cb, () => {
        cb(null, {
          publicKey,
          privateKey,
          cert,
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
  config.cert = initialization.cert;
}

module.exports = api;
