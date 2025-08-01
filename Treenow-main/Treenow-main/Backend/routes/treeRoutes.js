import express from 'express';
import Tree from '../models/treeModel.js';
import { protect, admin } from '../Midileware/authMiddleware.js'; 
const router = express.Router();

// ✅ GET all trees (Public)
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (error) {
    console.error('Error fetching trees:', error);
    res.status(500).json({ message: 'Failed to fetch trees.' });
  }
});

// ✅ GET single tree by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Tree not found' });
    res.json(tree);
  } catch (error) {
    console.error('Error retrieving tree:', error);
    res.status(500).json({ message: 'Error retrieving tree.' });
  }
});

// ✅ POST a new tree (Admin Only)
router.post('/', protect, admin, async (req, res) => {
  const {
    name,
    scientificName,
    image,
    description,
    watering,
    sunlight,
    specialCare,
    pruning,
    fertilization,
    price,
  } = req.body;

  if (
    !name ||
    !scientificName ||
    !image ||
    !description ||
    !watering ||
    !sunlight ||
    !specialCare ||
    !pruning ||
    !fertilization ||
    price === undefined 
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newTree = new Tree({
      name,
      scientificName,
      image,
      description,
      watering,
      sunlight,
      specialCare,
      pruning,
      fertilization,
      price,
    });

    await newTree.save();
    res.status(201).json(newTree);
  } catch (error) {
    console.error('Error adding tree:', error);
    res.status(500).json({ message: 'Error adding tree.' });
  }
});

// ✅ PUT (Update) tree by ID (Admin Only)
router.put('/:id', protect, async (req, res) => {
  const allowedFields = [
    'name',
    'scientificName',
    'image',
    'description',
    'watering',
    'sunlight',
    'specialCare',
    'pruning',
    'fertilization',
    'price',
  ];

  const updates = {};
  for (let key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const updatedTree = await Tree.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTree) {
      return res.status(404).json({ message: 'Tree not found' });
    }

    res.json(updatedTree);
  } catch (error) {
    console.error('Error updating tree:', error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE tree by ID (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (!tree) {
      return res.status(404).json({ message: 'Tree not found' });
    }

    await tree.deleteOne();
    res.json({ message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Error deleting tree:', error);
    res.status(500).json({ message: 'Error deleting tree.' });
  }
});

export default router;
