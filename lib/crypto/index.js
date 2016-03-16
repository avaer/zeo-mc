const forge = require('node-forge');
const pki = forge.pki;

const api = {
  generateKeys: function() {
    const keys = pki.rsa.generateKeyPair(2048);
    const publicKey = pki.publicKeyToPem(keys.publicKey);
    const privateKey = pki.privateKeyToPem(keys.privateKey);
    return {publicKey, privateKey};
  },
  generateCert: function(keys/*, attrs, extensions*/) {
    const publicKey = pki.publicKeyFromPem(keys.publicKey);
    const privateKey = pki.privateKeyFromPem(keys.privateKey);

    const cert = pki.createCertificate();
    cert.publicKey = publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [
      {
        name: 'commonName',
        value: 'localhost.kazmer.io'
      },
      {
        name: 'countryName',
        value: 'US'
      },
      {
        shortName: 'ST',
        value: 'Califoria'
      },
      {
        name: 'localityName',
        value: 'San Francisco'
      },
      {
        name: 'organizationName',
        value: 'kazmer.io'
      },
      {
        shortName: 'OU',
        value: 'Dev'
      }
    ];
    const extensions = [
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
      },
      /* {
        name: 'subjectAltName',
        altNames: [
          {
            type: 6, // URI
            value: 'http://example.org/webid#me'
          }, {
            type: 7, // IP
            ip: '127.0.0.1'
          }
        ]
      }, */
      {
        name: 'subjectKeyIdentifier'
      }
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions(extensions);
    cert.sign(privateKey);

    const pemCert = pki.certificateToPem(cert);
    return pemCert;
  }
};

module.exports = api;
