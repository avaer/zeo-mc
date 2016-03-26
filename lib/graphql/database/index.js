(function() {
"use strict";

const knex = require('knex');
const methods = require('./methods');

const createTables = methods.createTables;
const insertMockData = methods.insertMockData;

let _db = null;

const api = {};

api.initialize = opts => {
  const dbPath = opts.dbPath;

  _db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  });

  return createTables(_db)
    .then(insertMockData(_db))
    .then(Promise.resolve(null));
};
api.get = () => {
  return _db;
};

module.exports = api;

})();
