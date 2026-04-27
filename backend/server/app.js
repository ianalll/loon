const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
require('dotenv').config();

const cache = new Map();

// Функция получения данных из кэша
const getCached = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  // Проверяем не устарели ли данные
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

// Функция сохранения в кэш
const setCached = (key, data, ttlSeconds = 300) => {
  cache.set(key, {
    data: data,
    expiresAt: Date.now() + (ttlSeconds * 1000)
  });
};

// Функция очистки кэша
const clearCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

// Функция очистки всего кэша товаров и размеров
const clearProductCache = () => {
  clearCache('products_all');
  clearCache('product_sizes_');
};

const app = express();

app.use(cors());
app.use(express.json());

// НАСТРОЙКА ЗАГРУЗКИ ФАЙЛОВ

const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Доступ

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Доступ запрещен' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

// ТОВАРЫ - ДЛЯ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ

app.get('/api/products', async (req, res) => {
  const cacheKey = 'products_all';
  
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }
  
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as collection_name,
        CASE WHEN EXISTS (
          SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id AND ps.quantity > 0
        ) THEN true ELSE false END as in_stock
       FROM products p 
       LEFT JOIN collections c ON p.collection_id = c.id 
       WHERE p.is_active = true 
       ORDER BY p.id DESC`
    );
    setCached(cacheKey, result.rows, 300);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as collection_name 
       FROM products p 
       LEFT JOIN collections c ON p.collection_id = c.id 
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    res.status(500).json({ error: error.message });
  }
});

// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { first_name, last_name } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, first_name, last_name, phone, role, created_at',
      [first_name || null, last_name || null, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: error.message });
  }
});

// РАЗМЕРЫ ТОВАРА

app.get('/api/products/:id/sizes', async (req, res) => {
  const cacheKey = `product_sizes_${req.params.id}`;
  
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM product_sizes WHERE product_id = $1 ORDER BY size',
      [req.params.id]
    );
    setCached(cacheKey, result.rows, 300);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения размеров:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/products/:id/sizes', authenticateToken, authenticateAdmin, async (req, res) => {
  console.log('=== ДОБАВЛЕНИЕ РАЗМЕРА ===');
  console.log('Product ID:', req.params.id);
  console.log('Body:', req.body);
  
  const { size, quantity } = req.body;
  
  if (!size || size.trim() === '') {
    return res.status(400).json({ error: 'Размер обязателен' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO product_sizes (product_id, size, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (product_id, size) 
       DO UPDATE SET quantity = EXCLUDED.quantity 
       RETURNING *`,
      [req.params.id, size.toUpperCase(), quantity || 0]
    );
    console.log('Размер добавлен:', result.rows[0]);
    
    // Очищаем кэш товаров и размеров
    clearProductCache();
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка БД:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id/sizes/:size', authenticateToken, authenticateAdmin, async (req, res) => {
  console.log('=== УДАЛЕНИЕ РАЗМЕРА ===');
  console.log('Product ID:', req.params.id);
  console.log('Size:', req.params.size);
  
  try {
    const result = await pool.query(
      'DELETE FROM product_sizes WHERE product_id = $1 AND size = $2 RETURNING *',
      [req.params.id, req.params.size]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Размер не найден' });
    }
    console.log('Размер удален:', result.rows[0]);
    
    // Очищаем кэш товаров и размеров
    clearProductCache();
    
    res.json({ message: 'Размер удален', size: result.rows[0] });
  } catch (error) {
    console.error('Ошибка удаления размера:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id/sizes/:size', authenticateToken, authenticateAdmin, async (req, res) => {
  console.log('=== ОБНОВЛЕНИЕ КОЛИЧЕСТВА ===');
  console.log('Product ID:', req.params.id);
  console.log('Size:', req.params.size);
  console.log('Quantity:', req.body.quantity);
  
  const { quantity } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE product_sizes SET quantity = $1 WHERE product_id = $2 AND size = $3 RETURNING *',
      [quantity, req.params.id, req.params.size]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Размер не найден' });
    }
    console.log('Количество обновлено:', result.rows[0]);
    
    // Очищаем кэш товаров и размеров для этого товара
    clearCache('products_all');
    clearCache(`product_sizes_${req.params.id}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления количества:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// КОЛЛЕКЦИИ

app.get('/api/collections', async (req, res) => {
  const cacheKey = 'collections_all';
  
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }
  
  try {
    const result = await pool.query('SELECT * FROM collections ORDER BY id');
    setCached(cacheKey, result.rows, 600);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения коллекций:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM collections WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Коллекция не найдена' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения коллекции:', error);
    res.status(500).json({ error: error.message });
  }
});

// АДМИН-ПАНЕЛЬ

app.get('/api/admin/products', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as collection_name,
        CASE WHEN EXISTS (
          SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id AND ps.quantity > 0
        ) THEN true ELSE false END as in_stock
       FROM products p 
       LEFT JOIN collections c ON p.collection_id = c.id 
       ORDER BY p.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения товаров для админа:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/upload', authenticateToken, authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }
  
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
  res.json({ success: true, imageUrl: imageUrl, filename: req.file.filename });
});

app.post('/api/admin/products', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, category, price, color, description, image_url, is_new, is_promotion, collection_id, is_active } = req.body;
  
  const finalCollectionId = (collection_id === '' || collection_id === null || collection_id === undefined) 
    ? null 
    : parseInt(collection_id);
  
  try {
    const result = await pool.query(
      'INSERT INTO products (name, category, price, color, description, image_url, is_new, is_promotion, collection_id, is_active, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, category, price, color, description, image_url || null, is_new || false, is_promotion || false, finalCollectionId, is_active !== false, req.user.id]
    );
    
    const productWithCollection = await pool.query(
      `SELECT p.*, c.name as collection_name 
       FROM products p 
       LEFT JOIN collections c ON p.collection_id = c.id 
       WHERE p.id = $1`,
      [result.rows[0].id]
    );
    
    clearCache('products_all');
    res.json(productWithCollection.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, category, price, color, description, image_url, is_new, is_promotion, collection_id, is_active } = req.body;
  
  try {
    const currentProduct = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (currentProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const product = currentProduct.rows[0];
    
    const updatedName = name !== undefined ? name : product.name;
    const updatedCategory = category !== undefined ? category : product.category;
    const updatedPrice = price !== undefined ? price : product.price;
    const updatedColor = color !== undefined ? color : product.color;
    const updatedDescription = description !== undefined ? description : product.description;
    const updatedImageUrl = image_url !== undefined ? image_url : product.image_url;
    const updatedIsNew = is_new !== undefined ? is_new : product.is_new;
    const updatedIsPromotion = is_promotion !== undefined ? is_promotion : product.is_promotion;
    
    let updatedCollectionId = collection_id;
    if (updatedCollectionId === '' || updatedCollectionId === null || updatedCollectionId === undefined) {
      updatedCollectionId = null;
    } else {
      updatedCollectionId = parseInt(updatedCollectionId);
    }
    
    const updatedIsActive = is_active !== undefined ? is_active : product.is_active;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, category = $2, price = $3, color = $4, description = $5, image_url = $6, is_new = $7, is_promotion = $8, collection_id = $9, is_active = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
      [updatedName, updatedCategory, updatedPrice, updatedColor, updatedDescription, updatedImageUrl, updatedIsNew, updatedIsPromotion, updatedCollectionId, updatedIsActive, req.params.id]
    );
    
    const productWithCollection = await pool.query(
      `SELECT p.*, c.name as collection_name 
       FROM products p 
       LEFT JOIN collections c ON p.collection_id = c.id 
       WHERE p.id = $1`,
      [result.rows[0].id]
    );
    
    clearCache('products_all');
    res.json(productWithCollection.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления товара:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM product_sizes WHERE product_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    clearProductCache();
    
    res.json({ message: 'Товар удален', product: result.rows[0] });
  } catch (error) {
    console.error('Ошибка удаления товара:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id/hide', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    clearCache('products_all');
    
    res.json({ message: 'Товар скрыт', product: result.rows[0] });
  } catch (error) {
    console.error('Ошибка скрытия товара:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id/restore', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE products SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    clearCache('products_all');
    
    res.json({ message: 'Товар восстановлен', product: result.rows[0] });
  } catch (error) {
    console.error('Ошибка восстановления товара:', error);
    res.status(500).json({ error: error.message });
  }
});

// АДМИН-КОЛЛЕКЦИИ

app.post('/api/admin/collections', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, description } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Название коллекции обязательно' });
  }
  
  try {
    const existing = await pool.query('SELECT * FROM collections WHERE name = $1', [name]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Коллекция с таким названием уже существует' });
    }
    
    const result = await pool.query(
      'INSERT INTO collections (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description || null]
    );
    
    // Очищаем кэш коллекций и товаров
    clearCache('collections_all');
    clearCache('products_all');
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления коллекции:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/collections/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const { name, description } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Название коллекции обязательно' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE collections SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name.trim(), description || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Коллекция не найдена' });
    }
    
    clearCache('collections_all');
    clearCache('products_all');
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления коллекции:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/collections/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE products SET collection_id = NULL WHERE collection_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM collections WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Коллекция не найдена' });
    }
    
    clearCache('collections_all');
    clearCache('products_all');
    
    res.json({ message: 'Коллекция удалена', collection: result.rows[0] });
  } catch (error) {
    console.error('Ошибка удаления коллекции:', error);
    res.status(500).json({ error: error.message });
  }
});

// КОРЗИНА

app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1 AND p.is_active = true',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения корзины:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  const { product_id, quantity, size } = req.body;
  
  try {
    const existing = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 AND size = $3',
      [req.user.id, product_id, size]
    );
    
    if (existing.rows.length > 0) {
      const result = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 AND size = $4 RETURNING *',
        [quantity, req.user.id, product_id, size]
      );
      return res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity, size) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, product_id, quantity, size]
      );
      return res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cart/:id', authenticateToken, async (req, res) => {
  const { quantity } = req.body;
  
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Количество должно быть больше 0' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар в корзине не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления корзины:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар в корзине не найден' });
    }
    res.json({ message: 'Товар удален из корзины' });
  } catch (error) {
    console.error('Ошибка удаления из корзины:', error);
    res.status(500).json({ error: error.message });
  }
});

// ЗАКАЗЫ (ПОЛЬЗОВАТЕЛЬ)

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [req.params.id]
    );
    
    res.json({ 
      order: orderResult.rows[0], 
      items: itemsResult.rows 
    });
  } catch (error) {
    console.error('Ошибка получения заказа:', error);
    res.status(500).json({ error: error.message });
  }
});

// АДМИН-УПРАВЛЕНИЕ ЗАКАЗАМИ

// Получить все заказы (только для админа)
app.get('/api/admin/orders', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.email, u.first_name, u.last_name, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заказов для админа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить детали заказа для админа
app.get('/api/admin/orders/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const orderResult = await pool.query(
      `SELECT o.*, u.email, u.first_name, u.last_name, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = $1`,
      [req.params.id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [req.params.id]
    );
    
    res.json({ 
      order: orderResult.rows[0], 
      items: itemsResult.rows 
    });
  } catch (error) {
    console.error('Ошибка получения заказа для админа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Принять заказ
app.put('/api/admin/orders/:id/accept', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = $3 RETURNING *',
      ['processing', req.params.id, 'pending']
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Заказ не может быть принят (возможно, уже обработан или отменён)' });
    }
    
    res.json({ success: true, message: 'Заказ принят в обработку', order: result.rows[0] });
  } catch (error) {
    console.error('Ошибка принятия заказа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отклонить заказ
app.put('/api/admin/orders/:id/reject', authenticateToken, authenticateAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND status = $2',
      [req.params.id, 'pending']
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Заказ не может быть отклонён (возможно, уже обработан или отменён)' });
    }
    
    const itemsResult = await client.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id]
    );
    
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE product_sizes SET quantity = quantity + $1 WHERE product_id = $2 AND size = $3',
        [item.quantity, item.product_id, item.size]
      );
    }
    
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['rejected', req.params.id]
    );
    
    await client.query('COMMIT');
    
    clearProductCache();
    
    res.json({ success: true, message: 'Заказ отклонён' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка отклонения заказа:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Отправить заказ
app.put('/api/admin/orders/:id/ship', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = $3 RETURNING *',
      ['shipped', req.params.id, 'processing']
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Заказ не может быть отправлен' });
    }
    
    res.json({ success: true, message: 'Заказ отправлен', order: result.rows[0] });
  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Доставить заказ
app.put('/api/admin/orders/:id/deliver', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = $3 RETURNING *',
      ['delivered', req.params.id, 'shipped']
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Заказ не может быть доставлен' });
    }
    
    res.json({ success: true, message: 'Заказ доставлен', order: result.rows[0] });
  } catch (error) {
    console.error('Ошибка доставки заказа:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отменить заказ (админ)
app.put('/api/admin/orders/:id/cancel', authenticateToken, authenticateAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.status === 'delivered' || order.status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Заказ нельзя отменить' });
    }
    
    if (order.status === 'processing' || order.status === 'pending') {
      const itemsResult = await client.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [req.params.id]
      );
      
      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE product_sizes SET quantity = quantity + $1 WHERE product_id = $2 AND size = $3',
          [item.quantity, item.product_id, item.size]
        );
      }
    }
    
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['cancelled', req.params.id]
    );
    
    await client.query('COMMIT');
    
    clearProductCache();
    
    res.json({ success: true, message: 'Заказ отменён' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка отмены заказа:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Удалить заказ (админ) ПОЛНОСТЬЮ УДАЛИТЬ ИЗ БД
app.delete('/api/admin/orders/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    await client.query('DELETE FROM order_items WHERE order_id = $1', [req.params.id]);
    await client.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    
    await client.query('COMMIT');
    
    res.json({ success: true, message: 'Заказ удалён' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка удаления заказа:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ОТМЕНА ЗАКАЗА ПОЛЬЗОВАТЕЛЕМ

app.put('/api/orders/:id/cancel', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Заказ нельзя отменить, так как он уже обрабатывается' });
    }
    
    const itemsResult = await client.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id]
    );
    
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE product_sizes SET quantity = quantity + $1 WHERE product_id = $2 AND size = $3',
        [item.quantity, item.product_id, item.size]
      );
    }
    
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['cancelled', req.params.id]
    );
    
    await client.query('COMMIT');
    
    clearProductCache();
    
    res.json({ success: true, message: 'Заказ успешно отменён' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка отмены заказа:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ОФОРМЛЕНИЕ ЗАКАЗА

app.get('/api/user/address', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT address, phone FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0] || { address: null, phone: null });
  } catch (error) {
    console.error('Ошибка получения адреса:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/address', authenticateToken, async (req, res) => {
  const { address, phone } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE users SET address = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING address, phone',
      [address, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка сохранения адреса:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { 
    shipping_city, 
    shipping_street, 
    shipping_house, 
    shipping_apartment,
    shipping_entrance,
    shipping_floor,
    shipping_postal_code,
    recipient_name,
    recipient_phone
  } = req.body;
  
  if (!shipping_city || !shipping_street || !shipping_house || !recipient_name || !recipient_phone) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const cartResult = await client.query(
      `SELECT c.*, p.name, p.price, ps.quantity as stock_quantity, ps.size 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       JOIN product_sizes ps ON ps.product_id = p.id AND ps.size = c.size
       WHERE c.user_id = $1 AND p.is_active = true`,
      [req.user.id]
    );
    
    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Корзина пуста' });
    }
    
    for (const item of cartResult.rows) {
      if (item.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Товара "${item.name}" (размер ${item.size}) недостаточно на складе. Доступно: ${item.stock_quantity}` 
        });
      }
    }
    
    for (const item of cartResult.rows) {
      await client.query(
        'UPDATE product_sizes SET quantity = quantity - $1 WHERE product_id = $2 AND size = $3',
        [item.quantity, item.product_id, item.size]
      );
    }
    
    const totalAmount = cartResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const fullAddress = `${shipping_city}, ${shipping_street}, ${shipping_house}${shipping_apartment ? ', кв.' + shipping_apartment : ''}`;
    
    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, order_number, total_amount, status, 
        delivery_address, delivery_phone, 
        shipping_city, shipping_street, shipping_house, shipping_apartment, shipping_entrance, shipping_floor, shipping_postal_code,
        recipient_name, recipient_phone,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      [req.user.id, orderNumber, totalAmount, 'pending', fullAddress, recipient_phone,
       shipping_city, shipping_street, shipping_house, shipping_apartment || null, shipping_entrance || null, shipping_floor || null, shipping_postal_code || null,
       recipient_name, recipient_phone]
    );
    
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time, size, color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderResult.rows[0].id, item.product_id, item.quantity, item.price, item.size, item.color || null]
      );
    }
    
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    await client.query('COMMIT');
    
    clearProductCache();
    
    res.json({ 
      success: true, 
      order: orderResult.rows[0],
      message: 'Заказ успешно оформлен'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка оформления заказа:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ИЗБРАННОЕ

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT f.*, p.name, p.price, p.image_url FROM favorites f JOIN products p ON f.product_id = p.id WHERE f.user_id = $1 AND p.is_active = true',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  const { product_id } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, product_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:product_id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.user.id, req.params.product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден в избранном' });
    }
    res.json({ message: 'Товар удален из избранного' });
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    res.status(500).json({ error: error.message });
  }
});

// АВТОРИЗАЦИЯ

app.post('/api/register', async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;
  
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, phone, role, created_at',
      [email, passwordHash, first_name || null, last_name || null, phone || null, 'user']
    );
    
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: result.rows[0] });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
      } 
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

// ЗАПУСК СЕРВЕРА

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Подключение к PostgreSQL успешно!');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
}

startServer();