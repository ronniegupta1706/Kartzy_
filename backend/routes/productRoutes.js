// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts
} from '../controllers/productController.js';

import Product from '../models/Product.js'; // Import your model here

const router = express.Router();

// ✅ Tag-based route (place before /:id to avoid conflict)
router.get('/tag/:tag', async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const products = await Product.find({ tags: { $in: [tag] } }); // Adjust field as per your schema
    res.json(products);
  } catch (err) {
    console.error('Tag fetch error:', err);
    res.status(500).json({ message: 'Server error fetching products by tag' });
  }
});

// ✅ Keep these in order
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/', getAllProducts);

export default router;
