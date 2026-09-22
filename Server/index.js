import 'dotenv/config';
import express from 'express';
// import prisma from './src/db.js';
import { prisma } from './src/db.js';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'KhanaKhoj API is running 🚀',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
  });
});

app.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.post('/users', async (_req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'gourav230@gmail.com',
        name: 'Gourav Dutta',
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});