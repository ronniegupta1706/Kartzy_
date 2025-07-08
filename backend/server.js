// ❌ WRONG (CommonJS)
// const express = require('express');

// ✅ RIGHT (ES Module)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import userRoutes from './routes/userRoutes.js'; // ⬅️ Add this if you have it
import orderRoutes from './routes/orderRoutes.js'; // ⬅️ Add this if you have it
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

// Routes
app.use('/api/users', userRoutes); // ⬅️ if added

app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Product Routes (already correct)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/products/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryName,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
console.log("MONGO_URI:", process.env.MONGO_URI);
// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
