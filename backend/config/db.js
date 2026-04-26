// backend/config/db.js
const { Pool } = require('pg');

// Ключевая строка: Пытаемся взять DATABASE_URL из окружения Render,
// а если его нет (например, локально), то собираем строку из переменных.
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// Создаем пул подключений
const pool = new Pool({
  connectionString: connectionString,
  // Обязательно для Render: настройка SSL для продакшн-окружения
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
  } else {
    console.log('PostgreSQL подключен успешно!');
    release();
  }
});

module.exports = pool;