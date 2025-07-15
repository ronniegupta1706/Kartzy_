import Order from '../models/Order.js';
import moment from 'moment';
// — USER CONTROLLERS —
export const addOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (!orderItems || !orderItems.length) return res.status(400).json({ message: 'No order items' });
  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });
    const created = await order.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Add Order Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch Orders Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (order.isDelivered) return res.status(400).json({ message: 'Cannot cancel delivered order' });
    order.isCancelled = true;
    await order.save();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('Cancel Order Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// — ADMIN CONTROLLERS —
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    console.error('Fetch All Orders Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { isDelivered } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isDelivered = Boolean(isDelivered);
    order.deliveredAt = isDelivered ? Date.now() : null;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Update Order Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Delete Order Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

//track order status summary
export const getSalesPerDay = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true }, 'createdAt');
    const dailySales = {};

    orders.forEach(order => {
      const day = new Date(order.createdAt).toISOString().split('T')[0]; // "2025-07-15"
      dailySales[day] = (dailySales[day] || 0) + 1;
    });

    const result = Object.entries(dailySales)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, orders]) => ({ date, orders }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};