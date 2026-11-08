import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

// Підтягуємо порт з файлу .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Мідлвари (middleware)
app.use(cors());
app.use(express.json());
app.use(pino());

// Маршрути (ендпоінти)
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'List of notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `This is a note with ID: ${noteId}` });
});

app.get('/test-error', (req, res, next) => {
  next(new Error('Test server error'));
});

// Обробка помилки 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Обробка помилки 500
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
