const mockData = require('../mockData');
const users = mockData.users;
const chunks = mockData.chunks;

function insertUsers(db){
  return db('users').insert(users);
}

function insertChunks(db){
  return db('chunks').insert(chunks);
}

function insertMockData(db) {
  return insertUsers(db)
    .then(() => insertChunks(db));
}

module.exports = insertMockData;
