const createTables = require('./createTables');
const insertMockData = require('./insertMockData');

const api = {};

api.createTables = createTables;
api.insertMockData = insertMockData;

module.exports = api;
