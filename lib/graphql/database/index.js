(function() {
"use strict";

const knex = require('knex');
const methods = require('./methods');

const createTables = methods.createTables;
const insertUsers = methods.insertUsers;

let _db = null;

const api = {};

api.initialize = opts => {
  const dbPath = opts.dbPath;

  _db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    }
  });

  return createTables(_db)
    .then(insertUsers(_db))
    .then(Promise.resolve(null));
};
api.get = () => {
  return _db;
};

module.exports = api;

})();
