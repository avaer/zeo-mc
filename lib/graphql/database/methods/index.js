const createTables = require('./createTables');
const insertUsers = require('./insertUsers');

const api = {};

api.createTables = createTables;
api.insertUsers = insertUsers;

module.exports = api;
