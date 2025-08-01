import express from 'express';
import { protect, admin } from '../Midileware/authMiddleware.js';
import User from '../models/UserModel.js';
import Order from '../models/orders.js';

const router = express.Router();

// Get all users (Admin Only)
router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Get all orders (Admin Only)
router.get('/orders', protect, admin, async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

export default router;
