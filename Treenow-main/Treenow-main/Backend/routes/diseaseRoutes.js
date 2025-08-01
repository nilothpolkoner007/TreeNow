import express from 'express';
import Disease from '../models/disease.js';
import { protect, admin } from '../Midileware/authMiddleware.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { tree } = req.query;
    let query = {};

    if (tree) {
      query.tree = tree; 
    }

    const diseases = await Disease.find(query).populate('tree').populate('products');

    res.json(diseases);
  } catch (error) {
    console.error('❌ Error fetching diseases:', error);
    res.status(500).json({ message: 'Failed to fetch diseases.' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id).populate('tree').populate('products');
    if (!disease) return res.status(404).json({ message: 'Disease not found' });
    res.json(disease);
  } catch (error) {
    console.error('❌ Error retrieving disease:', error);
    res.status(500).json({ message: 'Error retrieving disease.' });
  }
});


router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, symptoms, tree, products } = req.body;

    if (!name || !symptoms || !tree) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newDisease = new Disease({
      name,
      symptoms,
      tree: tree || [],
      solutions: req.body.solutions || [],
      category: req.body.category || '',
      images: req.body.images || [],
      products: products || [], 
    });

    const savedDisease = await newDisease.save();
    res.status(201).json(savedDisease);
  } catch (error) {
    console.error('❌ Error creating disease:', error);
    res.status(500).json({ message: 'Failed to create disease.' });
  }
});

// ✅ PUT (Update) disease by ID (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedDisease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDisease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    res.json(updatedDisease);
  } catch (error) {
    console.error('❌ Error updating disease:', error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE disease by ID (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedDisease = await Disease.findByIdAndDelete(req.params.id);
    if (!deletedDisease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.json({ message: '✅ Disease deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting disease:', error);
    res.status(500).json({ message: 'Error deleting disease.' });
  }
});

export default router;
