import express from 'express';
import Cart from '../models/CartModel.js';
const router = express.Router();

// 🛒 Add Product to Cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {

      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find((p) => p.productId.toString() === productId);

    if (existingProduct) {
    
      existingProduct.quantity += 1;
    } else {
     
      cart.products.push({ productId, name, price, image, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
});

export default router;
