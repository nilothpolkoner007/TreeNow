import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Pencil } from 'lucide-react';

const AdminTree = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    image: '',
    description: '',
    watering: '',
    sunlight: '',
    specialCare: '',
    pruning: '',
    fertilization: '',
 
  });

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/trees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
      setError('Failed to load trees.');
    } finally {
      setLoading(false);
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

    try {
      let data;
      if (editId) {
        // Update tree
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_SERVER}/trees/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        data = response.data;
        setTrees((prev) => prev.map((tree) => (tree._id === editId ? data : tree)));
        setEditId(null);
      } else {
        // Create new tree
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/trees`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        data = response.data;
        setTrees((prev) => [...prev, data]);
      }

      // Reset form
      setFormData({
        name: '',
        scientificName: '',
        image: '',
        description: '',
        watering: '',
        sunlight: '',
        specialCare: '',
        pruning: '',
        fertilization: '',
      
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit tree data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/trees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        name: data.name,
        scientificName: data.scientificName,
        image: data.image,
        description: data.description,
        watering: data.watering,
        sunlight: data.sunlight,
        specialCare: data.specialCare,
        pruning: data.pruning,
        fertilization: data.fertilization,
      
      });

      setEditId(id);
    } catch (error) {
      console.error('Error fetching tree for edit:', error);
      setError('Failed to load tree for editing.');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/trees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrees((prev) => prev.filter((tree) => tree._id !== id));
    } catch (error) {
      console.error('Error deleting tree:', error);
      setError('Failed to delete tree.');
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>🌳 Manage Trees</h2>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {/* ✅ Tree Form */}
      <div className='bg-gray-100 p-4 mb-6 rounded'>
        <h3 className='font-semibold mb-2'>{editId ? 'Edit Tree' : 'Add New Tree'}</h3>
        <form onSubmit={handleSubmit}>
          {[
            'name',
            'scientificName',
            'image',
            'watering',
            'sunlight',
            'specialCare',
            'pruning',
            'fertilization',
     
          ].map((field) => (
            <input
              key={field}
              type={field === 'price' ? 'number' : 'text'}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className='border p-2 w-full mb-2'
              value={(formData as any)[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              required
            />
          ))}
          <a
            href='https://postimages.org/'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-blue-500 text-white px-4 py-2 mb-2 inline-block rounded'
          >
            📷 Upload Image
          </a>
          <textarea
            placeholder='Description'
            className='border p-2 w-full mb-2'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className='flex gap-2'>
            <button
              type='submit'
              className='bg-green-500 text-white px-4 py-2 rounded'
              disabled={loading}
            >
              {loading
                ? editId
                  ? 'Updating...'
                  : 'Adding...'
                : editId
                ? 'Update Tree'
                : 'Add Tree'}
            </button>

            {editId && (
              <button
                type='button'
                className='bg-gray-500 text-white px-4 py-2 rounded'
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    name: '',
                    scientificName: '',
                    image: '',
                    description: '',
                    watering: '',
                    sunlight: '',
                    specialCare: '',
                    pruning: '',
                    fertilization: '',
                    price: '',
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Tree List */}
      <h3 className='text-lg font-semibold'>🌿 Trees</h3>
      {trees.map((tree) => (
        <div
          key={tree._id}
          className='p-4 bg-gray-100 rounded-lg mb-4 flex justify-between items-center'
        >
          <div>
            <p>
              <strong>Name:</strong> {tree.name}
            </p>
            <p>
              <strong>Scientific Name:</strong> {tree.scientificName}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <img src={tree.image} alt={tree.name} className='h-16 w-16 object-cover rounded' />
            <button
              onClick={() => handleEdit(tree._id)}
              className='text-blue-500 hover:text-blue-700'
            >
              <Pencil className='h-5 w-5' />
            </button>
            <button
              onClick={() => handleDelete(tree._id)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 className='h-5 w-5' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTree;
