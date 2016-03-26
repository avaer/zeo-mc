const database = require('../database/index');
const db = database.get();

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

  return db('users').insert(newUser)
    .then(Promise.resolve(newUser));
}
api.resolveLogin = (rootValue, opts) => {
  const username = opts.username;
  const password = opts.password;

  return db.where('username', username).select('id', 'salt', 'passwordHash').from('users')
    .then(users => {
      if (users.length > 0) {
        const user = users[0];
        const id = user.id;
        const salt = user.salt;
        const passwordHash = user.passwordHash;
        const queryPasswordHash = salt + ':' + password;
        if (queryPasswordHash === passwordHash) {
          return Promise.resolve({
            id, 
            username,
            salt,
            passwordHash,
          });
        } else {
        return Promise.resolve(null);;
        }
      } else {
        return Promise.resolve(null);;
      }
    });
};

module.exports = api;
