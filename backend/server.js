import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import Product from './models/Product.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import productRoutes from './routes/productRoutes.js';

import adminRoutes from './routes/adminRoutes.js';

import reviewRoutes from './routes/reviewRoutes.js';
import authRoutes from './routes/auth.js';


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for product images
app.use('/images', express.static('images'));

// Routes
app.use('/api/users', userRoutes);      // user signup/login
app.use('/api/orders', orderRoutes);    // orders (user + admin)
app.use('/api/admin/products', adminProductRoutes); // admin product management
app.use('/api/products', productRoutes);

app.use('/api/admin', adminRoutes);    // admin dashboard and analytics

app.use('/api/reviews', reviewRoutes); // product reviews
app.use('/api/auth', authRoutes);      // authentication routes


// API check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Product routes
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

app.get('/api/trending', async (req, res) => {
  try {
    const { type = 'top_rated', category, limit = '12' } = req.query;

    // we only implement "top_rated" in step 1 (works with your current schema)
    const q = {};
    if (category) q.category = category;

    const l = Math.min(parseInt(limit, 10) || 12, 24); // cap to 24 just in case

    // sort: highest rating first, break ties with most reviews
    const products = await Product.find(q)
      .sort({ rating: -1, numreviews: -1 })
      .limit(l);

    res.json(products);
  } catch (error) {
    console.error('TRENDING ERROR:', error);
    res.status(500).json({ message: 'Server Error (trending)' });
  }
});

// MongoDB connection
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
