// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/dev1.sqlite3'
    },
    useNullAsDefault: true,
    migrations:{
        tableName: 'knex_migrations',
        directory: "./src/database/migrations"
    }
  },
  staging: {
    client: 'postgresql',
    // connection: {
    //   database: process.env.DATABASE_URL,
    //   user:     'username',
    //   password: 'password'
    // },
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./src/database/migrations"
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./src/database/migrations"
    }
  }

};
