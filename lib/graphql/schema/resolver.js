const crypto = require('crypto');
const database = require('../database/index');

const HASH_ALGORITHM = 'sha512';
const SECURITY_BITS = 256;

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
  const gender = opts.gender;

  const salt = _makeSalt();
  const passwordHash = _hashSaltPassword(salt, password);

  const user = {username, salt, passwordHash, gender};
  return new Promise((accept, reject) => {
    _createUser(user).then(() => {
      _getNewSessionForUsername(username).then(session => {
        accept({user, session});
      }).catch(reject);
    }).catch(reject);
  });
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
      const queryPasswordHash = _hashSaltPassword(salt, password);
      if (queryPasswordHash === passwordHash) {
        return _getNewSessionForUsername(username).then(session => {
          accept({user, session});
        });
      } else {
        accept(null);
      }
    }));
  } else if (session) {
    return _getUserBySession(session);
  } else {
    return Promise.resolve(null);
  }
};
api.resolveWorlds = (rootValue, opts) => {
  return _getWorlds();
};
api.resolveCreateWorld = (rootValue, opts) => {
  const worldname = opts.worldname;
  const seed = opts.seed;

  if (worldname && seed) {
    const world = {worldname, seed};
    return new Promise((accept, reject) => {
      _createWorld(world).then(() => {
        accept({world});
      }).catch(reject);
    });
  } else {
    return Promise.resolve(null);
  }
};
api.resolveDeleteWorld = (rootValue, opts) => {
  const worldname = opts.worldname;

  if (worldname) {
    return new Promise((accept, reject) => {
      _deleteWorld(worldname).then(() => {
        accept({worldname});
      }).catch(reject);
    });
  } else {
    return Promise.resolve(null);
  }
};

// crypto

function _makeSalt() {
  return crypto.randomBytes(SECURITY_BITS / 8).toString('base64');
}

function _hashSaltPassword(salt, password) {
  const hash = crypto.createHash(HASH_ALGORITHM);
  hash.update(salt, 'utf8');
  hash.update(':', 'utf8');
  hash.update(password, 'utf8');
  const digest = hash.digest('base64');
  return digest;
}

// users

function _createUser(user) {
  return new Promise((accept, reject) => {
    database.get()('users').insert(user)
      .then(accept).catch(reject);
  });
}

function _getUserByUsername(username) {
  return new Promise((accept, reject) => {
    database.get().where('username', username).select('id', 'salt', 'passwordHash').from('users').then(accept).catch(reject);
  }).then(users => {
    if (users.length > 0) {
      const user = users[0];
      const id = user.id;
      const salt = user.salt;
      const passwordHash = user.passwordHash;
      const gender = user.gender;

      return Promise.resolve({
        id,
        username,
        salt,
        passwordHash,
        gender,
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
  const session = crypto.randomBytes(SECURITY_BITS / 8).toString('base64');
  return new Promise((accept, reject) => {
    database.get()('session').insert({
      username,
      session
    }).then(accept).catch(reject);
  }).then(() => Promise.resolve(session));
}

// worlds

function _getWorlds() {
  return new Promise((accept, reject) => {
    database.get().select('worldname', 'seed').from('worlds').then(accept).catch(reject);
  });
}

function _createWorld(user) {
  return new Promise((accept, reject) => {
    database.get()('worlds').insert(world)
      .then(accept).catch(reject);
  });
}

function _deleteWorld(worldname) {
  return new Promise((accept, reject) => {
    database.get()('worlds').where('worldname', worldname).del()
      .then(accept).catch(reject);
  });
}

module.exports = api;
