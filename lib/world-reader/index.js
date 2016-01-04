const path = require('path');
const fs = require('fs');

const mime = require('mime');
const $ = require('cheerio');

const u = require('../lib/js-utils');

const NODE_TYPES = {
  NODE: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  COMMENT: 8
};

class WorldReader {
  constructor(opts) {
    this.dataDirectory = opts.dataDirectory;
  }

  getIndexJson(cb) {
    const indexPath = path.join(this.dataDirectory, 'index.html');

    fs.readFile(indexPath, 'utf8', u.ok(cb, s => {
      const $html = $.load(s);
      const domJson _buildDomJson($html);
      cb(null, {
        data: domJson,
        contentType: 'application/json'
      });
    }));
  }

  getFileStream(opts, cb) {
    const world = opts.world;
    const p = opts.path;

    if (!/\.\./.test(p)) {
      const filePath = path.join(this.dataDirectory, p);
      const readStream = fs.createReadStream(filePath);

      process.nextTick(() => {
        cb(null, {
          data: readStream,
          contentType: mime.lookup(filePath)
        });
      });
    } else {
      process.nextTick(() => {
        cb(u.error('ENOENT'));
      });
    }
  }
}

function _buildDomJson($rootEl) {
  const result = [];

  (function _recurse($el, acc) {
    $el.each((i, childEl) => {
      const nodeType = childEl.nodeType;
      if (~[NODE_TYPE_NODE, NODE_TYPE_COMMENT].indexOf(nodeType)) {
        const $childEl = $(childEl);
        const tagName = nodeType === NODE_TYPE_NODE ? childEl.tagName : 'span';
        const attrs = $childEl.attr();
        const children = [];
        const domJson = {tagName, attrs, children};

        _recurse($childEl, children);

        acc.push(domJson);
      }
    });
  })($rootEl, result);

  return result;
}

module.exports = WorldReader;
