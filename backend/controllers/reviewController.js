import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Add a review for an order's product
// @route   POST /api/reviews/:orderId
// @access  Private (user)
const addReview = async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Validate order ownership & delivered status
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Not authorized to review this order' });
    if (!order.isDelivered)
      return res.status(400).json({ message: 'You can only review delivered orders' });

    // Check if review already exists for this order & user
    const existingReview = await Review.findOne({
      user: userId,
      order: orderId,
    });
    if (existingReview)
      return res.status(400).json({ message: 'You have already reviewed this order' });

    // Create reviews for each product in the order with rating/comment
    // For simplicity, assuming one product per order or rating applies to whole order
    // If multiple products per order and want product-wise rating, modify accordingly

    // Here, let's create one review per product in orderItems
    const reviewsToCreate = order.orderItems.map((item) => ({
      user: userId,
      product: item.product,
      order: orderId,
      rating,
      comment,
    }));

    const createdReviews = await Review.insertMany(reviewsToCreate);

    // Update product ratings (average + numReviews)
    for (const rev of createdReviews) {
      const product = await Product.findById(rev.product);
      if (product) {
        const reviews = await Review.find({ product: product._id });
        product.numReviews = reviews.length;
        product.rating =
          reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
        await product.save();
      }
    }

    res.status(201).json({ message: 'Review(s) added successfully', reviews: createdReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { addReview, getReviewsByProduct };
