function createUsersTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('users', function(table) {
      table.increments().primary();
      table.string('username').unique();
      table.string('salt');
      table.string('passwordHash');
      table.string('gender');
    }).then(accept).catch(reject);
  });
}

function createSessionsTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('sessions', function(table) {
      table.increments().primary();
      table.string('session').unique();
      table.string('username');
    }).then(accept).catch(reject);
  });
}

function createWorldsTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('worlds', function(table) {
      table.increments().primary();
      table.string('worldname').unique();
      table.string('seed');
    }).then(accept).catch(reject);
  });
}

function createChunksTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('chunks', function(table) {
      table.increments().primary();
      table.string('worldname');
      table.decimal('x');
      table.decimal('y');
      table.decimal('z');

      table.binary('voxels');
      table.binary('depths');
      table.binary('vegetations');
      table.binary('entities');
      table.binary('weathers');
      table.binary('effects');

      table.index(['worldname', 'x', 'y', 'z'], 'chunkIndex');
    }).then(accept).catch(reject);
  });
}

function createTables(db) {
  return createUsersTable(db)
    .then(createSessionsTable(db))
    .then(createWorldsTable(db))
    .then(createChunksTable(db));
}

module.exports = createTables;
