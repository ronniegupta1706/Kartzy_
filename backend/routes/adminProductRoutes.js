// routes/adminProductRoutes.js
import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, createProduct);       // Add product
router.put('/:id', protect, isAdmin, updateProduct);     // Update product
router.delete('/:id', protect, isAdmin, deleteProduct);  // Delete product

export default router;
