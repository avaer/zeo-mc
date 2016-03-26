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

  return new Promise((accept, reject) => {
    database.get().where('username', username).select('id', 'salt', 'passwordHash').from('users').then(accept).catch(reject);
  }).then(users => {
    if (users.length > 0) {
      const user = users[0];
      const id = user.id;
      const salt = user.salt;
      const passwordHash = user.passwordHash;
      const queryPasswordHash = salt + ':' + password;
      if (queryPasswordHash === passwordHash) {
        const session = 'session';

        return Promise.resolve({
          user: {
            id,
            username,
            salt,
            passwordHash,
          },
          session
        });
      } else {
        return Promise.resolve(null);
      }
    } else {
      return Promise.resolve(null);
    }
  });
};

module.exports = api;
