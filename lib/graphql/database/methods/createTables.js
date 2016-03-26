function createUsersTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('users', function(table) {
      table.increments().primary();
      table.string('username');
      table.string('salt');
      table.string('passwordHash');
    }).then(accept).catch(reject);
  });
}

function createChunksTable(db) {
  return new Promise((accept, reject) => {
    db.schema.createTableIfNotExists('chunks', function(table) {
      table.increments().primary();
      table.decimal('x');
      table.decimal('y');
      table.decimal('z');
      table.string('values');

      table.index(['x', 'y', 'z'], 'chunkIndex');
    }).then(accept).catch(reject);
  });
}

function createTables(db) {
  return createUsersTable(db)
    .then(createChunksTable(db));
}

module.exports = createTables;
