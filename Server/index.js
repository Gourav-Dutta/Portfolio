// // src/index.js
// require('dotenv').config();
// const express = require('express');
// const prisma = require('./db');

import express from 'express';
import dotenv from 'dotenv';
import prisma from './src/db.js';

dotenv.config();
// const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // Allow parsing JSON request bodies

// GET: Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a user
app.post('/users', async (req, res) => {
//   const { email, name } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { 
        email: 'gourav@gmail.com',
        name: 'Gourav Dutta'
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
