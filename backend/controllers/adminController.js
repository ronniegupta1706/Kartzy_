// controllers/adminController.js
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Existing Analytics Route
export const getAnalyticsSummary = async (req, res) => {
  try {
    const products = await Product.find({}, 'category countInStock');
    const orders = await Order.find().populate('orderItems.product');

    const stockMap = {};
    const soldMap = {};
    let delivered = 0;
    let pending = 0;

    products.forEach((p) => {
      const category = (p.category || 'Unknown').trim().toLowerCase();
      if (category === 'footwear') return; // Exclude bad category
      stockMap[category] = (stockMap[category] || 0) + p.countInStock;
    });

    orders.forEach((order) => {
      if (order.isDelivered) delivered++;
      else pending++;

      order.orderItems.forEach(({ product, qty }) => {
        const cat = product?.category?.trim().toLowerCase();
        if (cat) soldMap[cat] = (soldMap[cat] || 0) + qty;
      });
    });

    res.json({
      orderStatus: { delivered, pending },
      stockByCategory: stockMap,
      soldByCategory: soldMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load analytics' });
  }
};

// ✅ NEW: Add Product Controller
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      brand,
      countInStock,
      type,
      tag,
    } = req.body;

    if (!name || !price || !description || !image || !category || !brand || !countInStock || !type) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (type === 'collection' && !tag) {
      return res.status(400).json({ message: 'Tag is required for collection products' });
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      brand,
      countInStock,
      type,
      tag: type === 'collection' ? tag : '',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};
