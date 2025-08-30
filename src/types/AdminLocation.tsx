import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil, MapPin } from 'lucide-react';

interface Tree {
  _id: string;
  name: string;
}

interface Location {
  _id: string;
  district: string;
  city: string;
  state: string;
  country: string;
  climate: string;
  trees: Tree[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  rainfall?: {
    annual: number;
    season: string;
  };
  soilType?: string;
}

const AdminLocation = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    district: '',
    city: '',
    state: '',
    country: 'India',
    climate: '',
    trees: [] as string[],
    coordinates: {
      latitude: '',
      longitude: ''
    },
    rainfall: {
      annual: '',
      season: ''
    },
    soilType: ''
  });

  const climateOptions = ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'];
  const seasonOptions = ['monsoon', 'winter', 'summer', 'year-round'];
  const soilOptions = ['clay', 'sandy', 'loamy', 'rocky', 'alluvial', 'black-cotton'];

  useEffect(() => {
    fetchLocations();
    fetchTrees();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load locations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrees = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/trees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      coordinates: formData.coordinates.latitude && formData.coordinates.longitude ? {
        latitude: parseFloat(formData.coordinates.latitude),
        longitude: parseFloat(formData.coordinates.longitude)
      } : undefined,
      rainfall: formData.rainfall.annual ? {
        annual: parseFloat(formData.rainfall.annual),
        season: formData.rainfall.season
      } : undefined
    };

    try {
      let response;
      if (editId) {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations/${editId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(prev => prev.map(loc => loc._id === editId ? response.data : loc));
        setEditId(null);
      } else {
        response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(prev => [...prev, response.data]);
      }

      // Reset form
      setFormData({
        district: '',
        city: '',
        state: '',
        country: 'India',
        climate: '',
        trees: [],
        coordinates: { latitude: '', longitude: '' },
        rainfall: { annual: '', season: '' },
        soilType: ''
      });
    } catch (error) {
      console.error('Error submitting location:', error);
      setError('Failed to save location.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      district: location.district,
      city: location.city,
      state: location.state,
      country: location.country,
      climate: location.climate,
      trees: location.trees.map(tree => tree._id),
      coordinates: {
        latitude: location.coordinates?.latitude?.toString() || '',
        longitude: location.coordinates?.longitude?.toString() || ''
      },
      rainfall: {
        annual: location.rainfall?.annual?.toString() || '',
        season: location.rainfall?.season || ''
      },
      soilType: location.soilType || ''
    });
    setEditId(location._id);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(prev => prev.filter(location => location._id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
      setError('Failed to delete location.');
    }
  };

  const resetForm = () => {
    setFormData({
      district: '',
      city: '',
      state: '',
      country: 'India',
      climate: '',
      trees: [],
      coordinates: { latitude: '', longitude: '' },
      rainfall: { annual: '', season: '' },
      soilType: ''
    });
    setEditId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
        <MapPin className="h-8 w-8 text-green-600" />
        <span>🗺️ Manage Locations</span>
      </h2>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {/* Location Form */}
      <div className="bg-gray-50 p-6 mb-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4 text-lg">
          {editId ? '✏️ Edit Location' : '➕ Add New Location'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="District"
              className="border p-3 rounded-lg"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="State"
              className="border p-3 rounded-lg"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border p-3 rounded-lg"
              value={formData.climate}
              onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
              required
            >
              <option value="">Select Climate</option>
              {climateOptions.map(climate => (
                <option key={climate} value={climate}>{climate}</option>
              ))}
            </select>
            <select
              className="border p-3 rounded-lg"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            >
              <option value="">Select Soil Type (Optional)</option>
              {soilOptions.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              placeholder="Latitude (Optional)"
              className="border p-3 rounded-lg"
              value={formData.coordinates.latitude}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: { ...formData.coordinates, latitude: e.target.value }
              })}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (Optional)"
              className="border p-3 rounded-lg"
              value={formData.coordinates.longitude}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: { ...formData.coordinates, longitude: e.target.value }
              })}
            />
          </div>

          {/* Rainfall */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Annual Rainfall (mm) - Optional"
              className="border p-3 rounded-lg"
              value={formData.rainfall.annual}
              onChange={(e) => setFormData({ 
                ...formData, 
                rainfall: { ...formData.rainfall, annual: e.target.value }
              })}
            />
            <select
              className="border p-3 rounded-lg"
              value={formData.rainfall.season}
              onChange={(e) => setFormData({ 
                ...formData, 
                rainfall: { ...formData.rainfall, season: e.target.value }
              })}
            >
              <option value="">Select Rainfall Season (Optional)</option>
              {seasonOptions.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          {/* Tree Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trees for this Location:
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
              {trees.map(tree => (
                <label key={tree._id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.trees.includes(tree._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, trees: [...formData.trees, tree._id] });
                      } else {
                        setFormData({ 
                          ...formData, 
                          trees: formData.trees.filter(id => id !== tree._id) 
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{tree.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Location' : 'Add Location')}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Locations List */}
      <h3 className="text-lg font-semibold mb-4">🗺️ Existing Locations</h3>
      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location._id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  {location.district}, {location.city}
                </h4>
                <p className="text-gray-600">{location.state}, {location.country}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {location.climate}
                  </span>
                  {location.soilType && (
                    <span className="bg-brown-100 text-brown-800 px-2 py-1 rounded-full">
                      {location.soilType} soil
                    </span>
                  )}
                  <span className="text-green-600">
                    {location.trees?.length || 0} trees
                  </span>
                </div>
                {location.coordinates && (
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="text-blue-500 hover:text-blue-700 p-2"
                  title="Edit Location"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(location._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete Location"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLocation;