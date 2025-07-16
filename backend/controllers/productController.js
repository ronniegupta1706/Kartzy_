import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search products by name
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q?.trim();
    if (!keyword) {
      return res.status(400).json({ message: 'No search keyword provided' });
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' },
    });

    res.json(products);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Create a new product (supports category & collection)
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
      rating, // ✅ Added
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
      rating: rating !== undefined ? Number(rating) : 0, // ✅ Safe fallback
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

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

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

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

// Get products by collection tag
export const getProductsByTag = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();

    const products = await Product.find({
      type: 'collection',
      tag: tag,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch products by tag',
      error: err.message,
    });
  }
};
