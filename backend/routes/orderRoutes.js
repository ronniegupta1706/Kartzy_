import express from 'express';
import {
  addOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// USER
router.post('/', protect, addOrder);
router.get('/myorders', protect, getUserOrders);
router.put('/:id/cancel', protect, cancelOrder);

// ADMIN
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.delete('/:id', protect, isAdmin, deleteOrder);

export default router;
