import express from 'express';
import { getAnalyticsSummary } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics-summary', protect, isAdmin, getAnalyticsSummary);

export default router;
