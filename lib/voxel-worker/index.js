(function() {
"use strict";

const path = require('path');

const WORKER_SCRIPT_PATH = path.join(__dirname, 'worker.js');

const api = {
  WORKER_SCRIPT_PATH,
};

module.exports = api;

})();
