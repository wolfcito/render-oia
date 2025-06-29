import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Inicializar conexión MySQL
async function initDB() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  return conn;
}

app.get('/api/hello', async (req, res) => {
  const conn = await initDB();
  const [rows] = await conn.query('SELECT NOW() AS now;');
  res.json({ message: '¡Hola desde Express!', time: rows[0].now });
  await conn.end();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express escuchando en puerto ${PORT}`);
});
