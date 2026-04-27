const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
  } else {
    console.log('PostgreSQL подключен успешно!');
    release();
  }
});

module.exports = pool;