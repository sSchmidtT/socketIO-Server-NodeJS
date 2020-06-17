
exports.up = function(knex, Promise) {
    return (knex.schema.createTable('event', function(t){
      t.increments().primary();
      t.string('command', 10).notNullable();
      t.boolean('realized');
      t.datetime('created_at');
      t.datetime('date_realized');
      t.integer('pinout_id').unsigned().notNullable();
      t.foreign('pinout_id').references('id').inTable('pinout');
    }).then(console.log('created event table')));
  };
  
  exports.down = function(knex) {
    knex.schema.dropTable('event');
    return knex;
  };
  