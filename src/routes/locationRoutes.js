import express from 'express';
import Location from '../models/Location.js';
import { protect, admin } from '../Midileware/authMiddleware.js';

const router = express.Router();

// Get all locations (Public)
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().select('district city state country');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});

// Get trees by location (Public)
router.get('/:locationId/trees', async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId)
      .populate('trees', 'name scientificName image description watering sunlight specialCare');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({
      location: {
        district: location.district,
        city: location.city,
        state: location.state,
        climate: location.climate
      },
      trees: location.trees
    });
  } catch (error) {
    console.error('Error fetching trees by location:', error);
    res.status(500).json({ message: 'Failed to fetch trees for location' });
  }
});

// Search locations by query (Public)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const locations = await Location.find({
      $or: [
        { district: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } }
      ]
    }).select('district city state country');

    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ message: 'Failed to search locations' });
  }
});

// Get trees by coordinates (GPS-based) (Public)
router.post('/nearby-trees', async (req, res) => {
  try {
    const { latitude, longitude, radius = 50000 } = req.body; // radius in meters (default 50km)

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const nearbyLocations = await Location.find({
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radius
        }
      }
    }).populate('trees', 'name scientificName image description watering sunlight specialCare');

    const allTrees = nearbyLocations.flatMap(location => 
      location.trees.map(tree => ({
        ...tree.toObject(),
        location: {
          district: location.district,
          city: location.city,
          state: location.state
        }
      }))
    );

    // Remove duplicates based on tree ID
    const uniqueTrees = allTrees.filter((tree, index, self) => 
      index === self.findIndex(t => t._id.toString() === tree._id.toString())
    );

    res.json({
      coordinates: { latitude, longitude },
      radius: radius / 1000, // Convert to km for response
      treesFound: uniqueTrees.length,
      trees: uniqueTrees
    });
  } catch (error) {
    console.error('Error fetching nearby trees:', error);
    res.status(500).json({ message: 'Failed to fetch nearby trees' });
  }
});

// Add new location (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { district, city, state, country, coordinates, trees, climate, rainfall, soilType } = req.body;

    if (!district || !city || !state || !climate) {
      return res.status(400).json({ message: 'District, city, state, and climate are required' });
    }

    const newLocation = new Location({
      district,
      city,
      state,
      country: country || 'India',
      coordinates,
      trees: trees || [],
      climate,
      rainfall,
      soilType
    });

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(400).json({ message: 'Error adding location', error: error.message });
  }
});

// Update location (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trees');

    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(400).json({ message: 'Error updating location', error: error.message });
  }
});

// Delete location (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Error deleting location' });
  }
});

export default router;