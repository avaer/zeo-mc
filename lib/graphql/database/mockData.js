const api = {};

api.users = [
  {
    // id: 1,
    username: 'username',
    salt: 'salt',
    passwordHash: 'salt:password',
    gender: 'male',
  },
];

api.sessions = [
  {
    // id: 1,
    username: 'username',
    session: 'session',
  },
];

api.chunks = [
  {
    // id: 1,
    x: 1,
    y: 2,
    z: 3,
    values: [0,1,2,3,4,5,6,7,8,9]
  },
];

module.exports = api;
