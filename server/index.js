// server/index.js
import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Calcular __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Inicialización de MySQL
async function initDB() {
  return mysql.createConnection({
    host:     process.env.MYSQL_HOST,
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}

// Rutas de API  
app.get('/api/hello', async (req, res) => {
  const conn = await initDB();
  const [rows] = await conn.query('SELECT NOW() AS now;');
  await conn.end();
  res.json({ message: '¡Hola desde Express!', time: rows[0].now });
});

app.get('/api/messages', async (req, res) => {
  const conn = await initDB();
  const [rows] = await conn.query('SELECT * FROM messages;');
  await conn.end();
  res.json(rows);
});

app.post('/api/messages', async (req, res) => {
  const { message } = req.body;
  const conn = await initDB();
  const [result] = await conn.query(
    'INSERT INTO messages (message) VALUES (?);',
    [message]
  );
  await conn.end();
  res.json({ insertedId: result.insertId });
});

// 1) Servir los archivos estáticos de React
app.use(express.static(path.join(__dirname, 'public')));

// 2) Para cualquier otra ruta (excepto /api) devolver index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
