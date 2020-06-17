
exports.up = function(knex) {
    return knex.schema.createTable('user', function(t){
      t.increments().primary();
      t.string('user',50).unique().notNullable();
      t.string('pws').notNullable();
      t.integer('accesslevel').notNullable();
      t.string('name').notNullable();
      t.string('email').notNullable().unique();
      t.boolean('active');
    }).then( function(){
      console.log('Created user table');
      return knex('user').insert([
        {
          user: "admin", 
          pws: "JsRoot198212@", 
          accesslevel: 5, 
          name: "Administrator", 
          email: "schmidt_tech@outlook.com", 
          active: true}
      ]);
      
    });
  };
  
  exports.down = function(knex) {
    knex.schema.dropTable('user');
    return knex;
  };
  