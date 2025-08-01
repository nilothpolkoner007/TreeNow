import express from 'express';
import Bonsai from '../Models/bonsaiModel.js';
import { protect, admin } from '../Midileware/authMiddleware.js'; // ✅ Import authentication middleware

const router = express.Router();

// ✅ GET all Bonsai items (Public)
router.get('/', async (req, res) => {
  try {
    const bonsaiItems = await Bonsai.find(); // ✅ Fixed incorrect variable name
    res.json(bonsaiItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch Bonsai items.' });
  }
});

// ✅ GET single Bonsai item by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const bonsaiItem = await Bonsai.findById(req.params.id);
    if (!bonsaiItem) return res.status(404).json({ message: 'Bonsai not found' });
    res.json(bonsaiItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving Bonsai item.' });
  }
});
// ✅ POST a new Bonsai item (Admin Only)
router.post('/', protect,  async (req, res) => {
  try {
    const newBonsai = new Bonsai(req.body);
    await newBonsai.save();
    res.status(201).json(newBonsai);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ POST a new Bonsai item (Admin Only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const newBonsai = new Bonsai(req.body);
    await newBonsai.save();
    res.status(201).json(newBonsai);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT (Update) Bonsai item by ID (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedBonsai = await Bonsai.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBonsai) {
      return res.status(404).json({ message: 'Bonsai not found' });
    }

    res.json(updatedBonsai);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE Bonsai item by ID (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedBonsai = await Bonsai.findByIdAndDelete(req.params.id);
    if (!deletedBonsai) {
      return res.status(404).json({ message: 'Bonsai not found' });
    }
    res.json({ message: 'Bonsai item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting Bonsai item.' });
  }
});

export default router;
