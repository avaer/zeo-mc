"use strict";

const path = require('path');
const fs = require('fs');
const request = require('request');
const bluebird = require('bluebird');
const mkdirp = require('mkdirp');
const htmlToText = require('html-to-text');

const PNG_DIRECTORY = path.join(__dirname, 'png');
const START_SKIN_PAGE = 160;
const END_SKIN_PAGE = 1000;

function recursePages(startSkinPage, endSkinPage, cb) {
  const map = {};

  (function recursePage(i) {
    if (i <= END_SKIN_PAGE) {
      (function retry() {
        console.log('------------');
        console.log('PAGE ' + i);
        console.log('------------');

        request.get({
          url: 'http://www.minecraftskins.com/latest/' + i + '/',
          encoding: 'utf8',
        }, (err, res, body) => {
          const text = htmlToText.fromString(body);

          const skinSpecs = (() => {
            const result = [];
            const regexp = /\[.*?\/([^\/]+?)\/\]\s*\[.*?\/newuploaded_skins\/([^\/]+?)\.png\]/g;
            let match;
            while (match = regexp.exec(text)) {
              const name = match[1];
              const id = match[2];
              if (!map[id]) {
                map[id] = true;
                result.push({
                  name,
                  id,
                });
              }
            }
            return result;
          })();

          const next = () => {
            recursePage(i + 1);
          };

          if (skinSpecs.length > 0) {

            bluebird.map(skinSpecs, skinSpec => new Promise((accept, reject) => {
              (function retry() {
                const name = skinSpec.name;
                const id = skinSpec.id;

                const description = name + ' (' + id + ')';
                console.log(description);
                const req = request.get({
                  url: 'http://www.minecraftskins.com/downloadnew.php?file=newuploaded_skins/' + id + '.png',
                  timeout: 5000
                });
                req.on('response', res => {
                  if (res.statusCode >= 200 && res.statusCode < 300 && res.headers['content-type'] !== 'text/html') {
                    const skinFilePath = path.join(PNG_DIRECTORY, name + '-' + id + '.png');
                    const ws = fs.createWriteStream(skinFilePath);
                    res.pipe(ws);

                    ws.on('error', err => { reject(err); });
                    ws.on('finish', () => { accept(); });
                  } else {
                    console.warn('FAILED: ' + description);
                    accept();
                  }
                });
                req.on('error', err => {
                  reject(err);
                });
              })();
            }, {
              concurrency: 4,
            }))
              .then(() => {
                next();
              })
              .catch(err => {
                console.warn(err);

                next();
              });
          } else {
            console.log('no skins', text.length);

            next();
          }
        });
      })();
    } else {
      cb();
    }
  })(startSkinPage);
}

mkdirp(PNG_DIRECTORY, err => {
  if (!err) {
    const startSkinPage = parseInt(process.argv[2], 10) || START_SKIN_PAGE;
    const endSkinPage = parseInt(process.argv[3], 10) || END_SKIN_PAGE;
    recursePages(startSkinPage, endSkinPage, err => {
      if (!err) {
        console.warn('done');
      } else {
        console.warn(err);
        process.exit(1);
      }
    });
  } else {
    console.warn(err);
    process.exit(1);
  }
});
