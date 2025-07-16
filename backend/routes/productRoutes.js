// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByTag,
} from '../controllers/productController.js';


const router = express.Router();

// ✅ Tag-based route (place before /:id to avoid conflict)
router.get('/tag/:tag', getProductsByTag);

// ✅ Keep these in order
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/', getAllProducts);

export default router;
