function createUsersTable(db) {
  return db.schema.createTableIfNotExists('users', function(table) {
    table.increments().primary();
    table.string('name');
    table.string('salt');
    table.string('passwordHash');
  });
}

function createChunksTable(db) {
  return db.schema.createTableIfNotExists('chunks', function(table) {
    table.increments().primary();
    table.decimal('x');
    table.decimal('y');
    table.decimal('z');
    table.string('values');

    table.index(['x', 'y', 'z'], 'chunkIndex');
  });
}

function createTables(db) {
  return createUsersTable(db)
    .then(() => createChunksTable(db));
}

module.exports = createTables;
