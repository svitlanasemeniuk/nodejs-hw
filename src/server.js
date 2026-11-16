import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Базові мідлвари (middleware)
app.use(logger);
app.use(cors());
app.use(express.json());

// 2. Підключаємо маршрути нотаток
app.use(notesRouter);

// 3. Обробка помилок 404 та 500 (завжди після маршрутів!)
app.use(notFoundHandler);
app.use(errorHandler);

// 4. Підключення до MongoDB та запуск сервера
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
