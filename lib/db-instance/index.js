"use strict";

const path = require('path');

const config = require('../config').get();
const Db = require('../db');

const DB_INSTANCE_PATH = path.join(config.dataDirectory, 'db');

const db = new Db(DB_INSTANCE_PATH);

module.exports = db;
