(function() {
"use strict";

const knex = require('knex');
const methods = require('./methods');

const createTables = methods.createTables;
const insertMockData = methods.insertMockData;

let _db = null;

function _getDb(dbPath) {
  return knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  });
}

const api = {};

api.create = opts => {
  const dbPath = opts.dbPath;

  _db = _getDb(dbPath);

  return createTables(_db)
    .then(insertMockData(_db))
    .then(Promise.resolve(null));
};
api.load = opts => {
  const dbPath = opts.dbPath;

  _db = _getDb(dbPath);

  return Promise.resolve(null);
};
api.get = () => {
  return _db;
};

module.exports = api;

})();
