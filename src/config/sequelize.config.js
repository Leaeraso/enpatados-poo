// config/config.js
module.exports = {
  development: {
    username: '...',
    password: '...',
    database: '...',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'enpatados_user',
    password: 'D0HO7e5kiMG2QzHgpljlBy7PFCDOgWTI',
    database: 'enpatados',
    host: 'dpg-cvre3pggjchc73b7ddb0-a.oregon-postgres.render.com',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}
