import express from 'express';
import Product from '../models/Product.js';
import { protect,admin } from '../Midileware/authMiddleware.js'; // Ensure this path is correct

const router = express.Router();

// 🛍️ Get all products (Admin Only)
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// 🔍 Get a single product by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});
router.post('/', protect, admin, async (req, res) => {
  try {
    let { name, category, use, image, description, price } = req.body;

    // Check if required fields are present
    if (!name || !category || !price || !use) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert price to a number & validate it
    price = Number(price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a valid number greater than zero' });
    }

    const newProduct = new Product({ name, category, use, image, description, price });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ message: 'Error adding product', error });
  }
});

// 🗑️ Delete product (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
