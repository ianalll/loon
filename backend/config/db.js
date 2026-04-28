// backend/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '2210',
  host: 'localhost',
  port: 5432,
  database: 'loon',
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