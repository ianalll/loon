const { Pool } = require('pg');

// Проверяем, что переменная задана
if (!process.env.DATABASE_URL) {
  console.error('Ошибка: DATABASE_URL не задана в переменных окружения');
  process.exit(1); // завершаем процесс с ошибкой
}

// Настройки SSL в зависимости от окружения
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProduction && {
    ssl: {
      rejectUnauthorized: true, // в production используем строгую проверку
    }
  })
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('PostgreSQL подключен успешно!');
    release();
  }
});

module.exports = pool;