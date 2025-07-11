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

// Search products
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q?.trim();

    if (!keyword) {
      return res.status(400).json({ message: 'No search keyword provided' });
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' }
    });

    res.json(products);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, brand, countInStock } = req.body;
    const product = new Product({ name, price, description, image, category, brand, countInStock });
    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, price, description, image, category, brand, countInStock } = req.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock || product.countInStock;

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
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};
