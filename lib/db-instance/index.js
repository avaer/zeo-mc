"use strict";

const path = require('path');

const config = require('../config');
const Db = require('../db');

const DB_INSTANCE_PATH = path.join(config.dataDirectory, 'db');

module.exports = new Db(DB_INSTANCE_PATH);
