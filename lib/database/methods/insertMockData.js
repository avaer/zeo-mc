const mockData = require('../mockData');
const users = mockData.users;
const sessions = mockData.sessions;
const worlds = mockData.worlds;
const chunks = mockData.chunks;

function insertUsers(db){
  return new Promise((accept, reject) => {
    db('users').insert(users).then(accept).catch(reject);
  });
}

function insertSessions(db){
  return new Promise((accept, reject) => {
    db('sessions').insert(sessions).then(accept).catch(reject);
  });
}

function insertWorlds(db){
  return new Promise((accept, reject) => {
    db('worlds').insert(worlds).then(accept).catch(reject);
  });
}

function insertChunks(db){
  return new Promise((accept, reject) => {
    db('chunks').insert(chunks).then(accept).catch(reject);
  });
}

function insertMockData(db) {
  return insertUsers(db)
    .then(insertSessions(db))
    .then(insertWorlds(db))
    .then(insertChunks(db));
}

module.exports = insertMockData;
