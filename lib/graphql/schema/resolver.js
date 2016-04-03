(function() {
"use strict";

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

  const newUser = {username, salt, passwordHash, gender};
  return new Promise((accept, reject) => {
    _createUser(newUser).then(user => {
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
    return new Promise((accept, reject) => {
      _getUserByUsername(username).then(user => {
        const id = user.id;
        const salt = user.salt;
        const passwordHash = user.passwordHash;
        const queryPasswordHash = _hashSaltPassword(salt, password);
        if (queryPasswordHash === passwordHash) {
          _getNewSessionForUsername(username).then(session => {
            accept({user, session});
          }).catch(reject);
        } else {
          accept(null);
        }
      }).catch(reject);
    });
  } else if (session) {
    return _getUserBySession(session).then(user => {
      return Promise.resolve({user, session});
    });
  } else {
    return Promise.resolve(null);
  }
};
api.resolveWorld = (rootValue, opts) => {
  const worldname = opts.worldname;

  return new Promise((accept, reject) => {
    _getWorld(worldname).then(world => {
      accept({world});
    }).catch(reject);
  });
};
api.resolveWorlds = (rootValue, opts) => {
  return new Promise((accept, reject) => {
    _getWorlds().then(worlds => {
      accept({worlds});
    }).catch(reject);
  });
};
api.resolveCreateWorld = (rootValue, opts) => {
  const worldname = opts.worldname;
  const seed = opts.seed;

  if (worldname && seed) {
    const newWorld = {worldname, seed};
    return new Promise((accept, reject) => {
      _createWorld(newWorld).then(world => {
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

// misc

function _copy(a, b) {
  for (let k in a) {
    b[k] = a[k];
  }
}

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

function _createUser(newUser) {
  return new Promise((accept, reject) => {
    database.get()('users').insert(newUser)
      .then(ids => {
        const id = ids[0];
        const user = {id};
        _copy(newUser, user);
        accept(user);
      }).catch(reject);
  });
}

function _getUserByUsername(username) {
  return new Promise((accept, reject) => {
    database.get().where('username', username).select('id', 'salt', 'passwordHash', 'gender').from('users').then(users => {
      if (users.length > 0) {
        const user = users[0];
        const id = user.id;
        const salt = user.salt;
        const passwordHash = user.passwordHash;
        const gender = user.gender;

        accept({
          id,
          username,
          salt,
          passwordHash,
          gender,
        });
      } else {
        accept(null);
      }
    }).catch(reject);
  });
}

function _getUserBySession(session) {
  return new Promise((accept, reject) => {
    database.get().where('session', session).select('username').from('sessions').then(sessions => {
      if (sessions.length > 0) {
        const session = sessions[0];
        const username = session.username;
        _getUserByUsername(username).then(accept).catch(reject);
      } else {
        accept(null);
      }
    }).catch(reject);
  });
}

function _getNewSessionForUsername(username) {
  return new Promise((accept, reject) => {
    const session = crypto.randomBytes(SECURITY_BITS / 8).toString('base64');
    database.get()('sessions').insert({
      session,
      username,
    }).then(() => {
      accept(session);
    }).catch(reject);
  });
}

// worlds

function _getWorld(worldname) {
  return new Promise((accept, reject) => {
    database.get().select('worldname', 'seed').from('worlds').then(worlds => {
      if (worlds.length > 0) {
        const world = worlds[0];
        const id = world.id;
        const worldname = world.worldname;
        const seed = world.seed;

        accept({
          id,
          worldname,
          seed,
        });
      } else {
        accept(null);
      }
    }).catch(reject);
  });
}

function _getWorlds() {
  return new Promise((accept, reject) => {
    database.get().select('worldname', 'seed').from('worlds').then(accept).catch(reject);
  });
}

function _createWorld(newWorld) {
  return new Promise((accept, reject) => {
    database.get()('worlds').insert(newWorld)
      .then(ids => {
        const id = ids[0];
        const world = {id};
        _copy(newWorld, world);
        accept(world);
      }).catch(reject);
  });
}

function _deleteWorld(worldname) {
  return new Promise((accept, reject) => {
    database.get()('worlds').where('worldname', worldname).del()
      .then(accept).catch(reject);
  });
}

module.exports = api;

})();
