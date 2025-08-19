// controllers/productController.js
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/* ==========================
   BASIC PRODUCT HANDLERS
========================== */

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q?.trim();
    if (!keyword) return res.status(400).json({ message: 'No search keyword provided' });

    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' },
    });

    res.json(products);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      image,
      category,
      brand,
      countInStock,
      type,
      tag,
      rating,
    } = req.body;

    if (!name || !price || !description || !image || !brand || !countInStock || !type) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (type === 'category' && !category) {
      return res.status(400).json({ message: 'Category is required for category type' });
    }

    if (type === 'collection' && !tag) {
      return res.status(400).json({ message: 'Tag is required for collection products' });
    }

    const parsedPrice = Number(price);
    const parsedOriginal = originalPrice ? Number(originalPrice) : null;

    const discountPercent =
      parsedOriginal && parsedOriginal > parsedPrice
        ? Math.round(((parsedOriginal - parsedPrice) / parsedOriginal) * 100)
        : 0;

    const product = new Product({
      name,
      price: parsedPrice,
      originalPrice: parsedOriginal,
      discountPercent,
      description,
      image,
      brand,
      countInStock: Number(countInStock),
      rating: rating !== undefined ? Number(rating) : 0,
      type,
      category: type === 'category' ? category : undefined,
      tag: type === 'collection' ? tag : undefined,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

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
      rating,
      originalPrice,
    } = req.body;

    const parsedPrice = price !== undefined ? Number(price) : product.price;
    const parsedOriginal = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;

    const discountPercent =
      parsedOriginal && parsedOriginal > parsedPrice
        ? Math.round(((parsedOriginal - parsedPrice) / parsedOriginal) * 100)
        : 0;

    product.name = name || product.name;
    product.price = parsedPrice;
    product.originalPrice = parsedOriginal;
    product.discountPercent = discountPercent;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.type = type || product.type;
    product.tag = type === 'collection' ? tag : '';
    product.rating = rating ?? product.rating;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

export const getProductsByTag = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const products = await Product.find({ type: 'collection', tag });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products by tag', error: err.message });
  }
};

export const getTrendingProducts = async (req, res) => {
  try {
    const { type = 'top_rated', category, limit = '12' } = req.query;

    const query = {};
    if (category) query.category = category;

    let sort = {};
    switch (type) {
      case 'most_reviewed':
        sort = { numreviews: -1, rating: -1 };
        break;
      case 'new_arrivals':
        sort = { createdAt: -1 };
        break;
      case 'best_deals':
        sort = { discountPercent: -1, rating: -1, numreviews: -1 };
        break;
      case 'top_rated':
      default:
        sort = { rating: -1, numreviews: -1 };
        break;
    }

    const l = Math.min(parseInt(limit, 10) || 12, 24);
    const products = await Product.find(query).sort(sort).limit(l);

    res.json(products);
  } catch (err) {
    console.error('TRENDING ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch trending products', error: err.message });
  }
};

/* ==========================
   PERSONALIZED CAROUSELS
========================== */

// 1) Top Picks for You (personalized, fallback to “popular”)
export const getTrendingAndRelated = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 12);

    // Try to personalize using user order history if available (req.user optional)
    let picks = [];

    if (req.user?._id) {
      const orders = await Order.find({ user: req.user._id })
        .populate('orderItems.product')
        .lean();

      const categories = new Set();
      orders.forEach(o =>
        o.orderItems.forEach(oi => {
          if (oi.product?.category) categories.add(oi.product.category);
        })
      );

      if (categories.size) {
        // Random sample from those categories (avoid “the same few”)
        const byCats = await Product.aggregate([
          { $match: { type: 'category', category: { $in: [...categories] } } },
          { $sample: { size: limit } },
        ]);
        picks = byCats;
      }
    }

    // Fallback: overall popular (most reviewed)
    if (picks.length === 0) {
      picks = await Product.find({ type: 'category' })
        .sort({ numreviews: -1, rating: -1 })
        .limit(limit)
        .lean();
    }

    res.json(picks);
  } catch (err) {
    console.error('Error in getTrendingAndRelated:', err);
    res.status(500).json({ message: 'Failed to fetch personalized picks' });
  }
};

// 2) You May Also Like (related-but-different, no repeats)
export const getAlsoLike = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 12);

    // Build a category pool from recent orders (if any)
    let categories = [];
    if (req.user?._id) {
      const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('orderItems.product')
        .lean();

      const set = new Set();
      orders.forEach(o =>
        o.orderItems.forEach(oi => {
          if (oi.product?.category) set.add(oi.product.category);
        })
      );
      categories = [...set];
    }

    let results;
    if (categories.length) {
      results = await Product.aggregate([
        { $match: { type: 'category', category: { $in: categories } } },
        { $sample: { size: limit } },
      ]);
    } else {
      // Guest or no orders yet → diversify by random set
      results = await Product.aggregate([
        { $match: { type: 'category' } },
        { $sample: { size: limit } },
      ]);
    }

    res.json(results);
  } catch (err) {
    console.error('Error in getAlsoLike:', err);
    res.status(500).json({ message: 'Failed to fetch also-like products' });
  }
};
