const crypto = require('crypto');
const database = require('../database/index');

// Hooray for Functional Programming //

//Helpers//

/* async function getUserIdFromName(name){
  let getId = compose(prop('id'), head)
  let result = await db.where('name', name).select('id').from('users');

  return getId(result);
} */

//GraphQL Query Resolvers//

/* export async function resolveUsers(rootValue, {name} ){
  const result = await db.where('name', name).select('id', 'passwordHash').from('users');
  const {id, passwordHash} = result;

  return {
    id: id, 
    name: name, 
    passwordHash,
  };
} */

//GraphQL Mutation Resolvers//

const api = {};

api.resolveCreateUser = (rootValue, opts) => {
  const username = opts.username;
  const password = opts.password;

  const salt = 'salt';
  const passwordHash = salt + ':' + password;

  const newUser = {username, salt, passwordHash};

  return new Promise((accept, reject) => {
    database.get()('users').insert(newUser).then(accept).catch(reject);
  }).then(Promise.resolve(newUser));
}
api.resolveLogin = (rootValue, opts) => {
  const username = opts.username;
  const password = opts.password;
  const session = opts.session;

  if (username && password) {
    return _getUserByUsername(username).then(user => new Promise((accept, reject) => {
      const id = user.id;
      const salt = user.salt;
      const passwordHash = user.passwordHash;
      const queryPasswordHash = salt + ':' + password;
      if (queryPasswordHash === passwordHash) {
        return _getNewSessionForUsername(username).then(session => Promise.resolve({user, session}));
      } else {
        return Promise.resolve(null);
      }
    }));
  } else if (session) {
    return _getUserBySession(session);
  } else {
    return Promise.resolve(null);
  }
};

function _getUserByUsername(username) {
  return new Promise((accept, reject) => {
    database.get().where('username', username).select('id', 'salt', 'passwordHash').from('users').then(accept).catch(reject);
  }).then(users => {
    if (users.length > 0) {
      const user = users[0];
      const id = user.id;
      const salt = user.salt;
      const passwordHash = user.passwordHash;

      return Promise.resolve({
        user: {
          id,
          username,
          salt,
          passwordHash,
        },
      });
    } else {
      return Promise.resolve(null);
    }
  });
}

function _getUserBySession(session) {
  new Promise((accept, reject) => {
    database.get().where('session', session).select('username').from('session').then(accept).catch(reject);
  }).then(sessions => {
    if (sessions.length > 0) {
      const session = sessions[0];
      const username = session.username;
      return _getUserByUsername(username);
    } else {
      return Promise.resolve(null);
    }
  });
}

function _getNewSessionForUsername(username) {

  new Promise((accept, reject) => {
    database.get()('sessions').insert({

    }).then(accept).catch(reject);
  }).then(sessions => {
    if (sessions.length > 0) {
      const session = sessions[0];
      const username = session.username;
      return _getUserByUsername(username);
    } else {
      return Promise.resolve(null);
    }
  });
}

module.exports = api;
