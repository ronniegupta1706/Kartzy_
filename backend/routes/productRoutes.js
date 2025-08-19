// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByTag,
  getTrendingProducts,
  getTrendingAndRelated,
  getAlsoLike,
} from '../controllers/productController.js';

// NOTE: route is open for both guests and logged-in users.
// If you already have an auth middleware and want req.user,
// you can add it here without making it mandatory.
const router = express.Router();

// Tag-based route
router.get('/tag/:tag', getProductsByTag);

// Search
router.get('/search', searchProducts);

// Personalized sections
router.get('/trending-and-related', getTrendingAndRelated); // "Top Picks for You"
router.get('/also-like', getAlsoLike);                      // "You May Also Like"

// Trending only (generic)
router.get('/trending', getTrendingProducts);

// Single product & all products
router.get('/:id', getProductById);
router.get('/', getAllProducts);

export default router;
