import express from 'express';
import { addReview, getReviewsByProduct } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST review for an order (only if delivered and belongs to user)
router.post('/:orderId', protect, addReview);

// GET reviews for a product
router.get('/product/:productId', getReviewsByProduct);

export default router;