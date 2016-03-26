const mockData = require('../mockData');
const users = mockData.users;
const chunks = mockData.chunks;

function insertUsers(db){
  return new Promise((accept, reject) => {
    db('users').insert(users).then(accept).catch(reject);
  });
}

function insertChunks(db){
  return new Promise((accept, reject) => {
    db('chunks').insert(chunks).then(accept).catch(reject);
  });
}

function insertMockData(db) {
  return insertUsers(db)
    .then(insertChunks(db));
}

module.exports = insertMockData;
