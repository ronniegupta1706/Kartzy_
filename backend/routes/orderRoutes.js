import express from 'express';
import { addOrder, getUserOrders, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrder);               // Place order
router.get('/myorders', protect, getUserOrders);   // Get user orders
router.put('/:id/cancel', protect, cancelOrder);   // Cancel order


export default router;
