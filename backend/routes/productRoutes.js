// routes/productRoutes.js
import express from 'express';
import { getAllProducts, getProductById, searchProducts } from '../controllers/productController.js';

const router = express.Router();

// ✅ PLACE THIS FIRST so it's matched before /:id
router.get('/search', searchProducts);

// THEN put the dynamic /:id route
router.get('/:id', getProductById);

router.get('/', getAllProducts);

export default router;
