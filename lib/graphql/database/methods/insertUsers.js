const mockData = require('../mockData');

const users = mockData.users;

function insertUsers(db){
  return db('users').insert(users);
}

module.exports = insertUsers;
