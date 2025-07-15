// controllers/adminController.js
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getAnalyticsSummary = async (req, res) => {
  try {
    const products = await Product.find({}, 'category countInStock');
    const orders = await Order.find().populate('orderItems.product');

    const stockMap = {};
    const soldMap = {};
    let delivered = 0;
    let pending = 0;

    // Stock by category
    products.forEach((p) => {
      const category = (p.category || 'Unknown').trim().toLowerCase();
      if (category === 'footwear') return; // Exclude bad category
      stockMap[category] = (stockMap[category] || 0) + p.countInStock;
    });

    // Order status and units sold
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
