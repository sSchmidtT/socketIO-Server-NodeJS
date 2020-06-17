
exports.up = function(knex, Promise) {
    return (
      knex.schema.createTable('device', function(t){
        t.increments().primary();
        t.string('name', 50).unique().notNullable();
        t.string('mac', 17).unique().notNullable();
        t.boolean('active');
        t.string('socketIO').notNullable();
      }).then(console.log('created device table')));
  };
  
  exports.down = function(knex) {
    knex.schema.dropTable('device');
  
    return knex;
  };
  