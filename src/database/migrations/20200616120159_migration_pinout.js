
exports.up = function(knex, Promise) {
    return (knex.schema.createTable('pinout', function(t){
      t.increments().primary();
      t.string('pinname', 50).notNullable();
      t.string('type', 20).notNullable();
      t.boolean('active');
      t.string('pintype',1).notNullable();
      t.integer('number').notNullable();
      t.string('parent',50);
      t.integer('accesslevel').notNullable();
      t.integer('device_id').unsigned().notNullable();
      t.foreign('device_id').references('id').inTable('device');
    }).then(console.log('created pinout table')));
  };
  
  exports.down = function(knex) {
    knex.schema.dropTable('pinout');
    return knex;
  };
  