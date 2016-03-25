function createTables(db) {
  return db.schema.createTable('users', function(table) {
    table.increments().primary();
    table.string('name');
    table.string('salt');
    table.string('passwordHash');
  })
}

module.exports = createTables;
