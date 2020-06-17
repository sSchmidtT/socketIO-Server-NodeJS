
exports.up = function(knex) {
    return (knex.schema.createTable('controldevices', function(t){
      t.string('device').unique().notNullable().primary();
      t.string('fcmtoken');
      t.boolean('active');
      t.integer('user_id').unsigned().notNullable();
      t.foreign('user_id').references('id').inTable('user');
    }).then(console.log('created controldevices table')));
  };
  
  exports.down = function(knex) {
      knex.schema.dropTable('controldevices');
      return knex;
  };
  