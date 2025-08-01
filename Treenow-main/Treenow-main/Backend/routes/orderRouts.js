import express from 'express';
import Order from '../models/orders.js';
import { protect, admin } from '../Midileware/authMiddleware.js';

const router = express.Router();

// ✅ Create a new order (User)
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({ user: req.user._id, items, totalAmount });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// ✅ Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error });
  }
});

// ✅ Get all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// ✅ Update an order (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, actionMessage } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    order.actionMessage = actionMessage || order.actionMessage;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});


// ✅ Delete an order (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

export default router;
