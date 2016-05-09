"use strict";

const path = require('path');
const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');

const PNG_DIRECTORY = path.join(__dirname, 'png');
const NUM_SKIN_PAGES = 200;

function recursePages(cb) {
  const map = {};

  (function recursePage(i) {
    if (i < NUM_SKIN_PAGES) {
      request.get({
        url: 'http://www.minecraftskins.com/latest/' + i + '/',
        encoding: 'utf8',
      }, (err, res, body) => {
        const skinSpecs = (() => {
          const result = [];
          let regexp = /<a href=".*?\/skin\/[^\/]+\/(.+?)\/"[^>]*>\s*<div[^>]*data-url=".*?\/newuploaded_skins\/(.+?)\.png"/g, match;
          while (match = regexp.exec(body)) {
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
          let pending = skinSpecs.length;
          let error = null;
          const pend = err => {
            error = error || err;
            if (--pending === 0) {
              if (!err) {
                next();
              } else {
                cb(err);
              }
            }
          };

          skinSpecs.forEach(skinSpec => {
            const name = skinSpec.name;
            const id = skinSpec.id;

            const description = name + ' (' + id + ')';
            console.log(description);
            const req = request.get({
              url: 'http://www.minecraftskins.com/downloadnew.php?file=newuploaded_skins/' + id + '.png',
            });
            req.on('response', res => {
              if (res.statusCode >= 200 && res.statusCode < 300 && res.headers['content-type'] !== 'text/html') {
                const skinFilePath = path.join(PNG_DIRECTORY, name);
                const ws = fs.createWriteStream(skinFilePath);
                res.pipe(ws);

                res.on('error', err => { pend(err); });
                res.on('finish', () => { pend(); });
              } else {
                console.warn('FAILED: ' + description);
                pend();
              }
            });
            req.on('error', err => { pend(err); });
          });
        } else {
          next();
        }
      });
    } else {
      cb();
    }
  })(0);
}

mkdirp(PNG_DIRECTORY, err => {
  if (!err) {
    recursePages(err => {
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
