// routes/productRoutes.js
import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);        // GET all products
router.get('/:id', getProductById);     // GET single product

export default router;
