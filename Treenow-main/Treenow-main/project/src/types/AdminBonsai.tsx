import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react'; // ✅ Import Delete Icon

const AdminBonsai = () => {
  const [bonsai, setBonsai] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    image: '',
    owner: '',
    link: '',
    age: '',
    description: '',
    watering: '',
    sunlight: '',
    specialCare: '',
    pruning: '',
    fertilization: '',
    price: '',
  });

  useEffect(() => {
    fetchBonsai();
  }, []);

  // ✅ Fetch Bonsai from API
  const fetchBonsai = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/bonsai`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBonsai(data);
    } catch (error) {
      console.error('Error fetching bonsai:', error);
      setError('Failed to load bonsai.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add New Bonsai
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
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/bonsai`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setBonsai((prev) => [...prev, data]);

      // ✅ Reset form after submission
      setFormData({
        name: '',
        scientificName: '',
        image: '',
        owner: '',
        link: '',
        age: '',
        description: '',
        watering: '',
        sunlight: '',
        specialCare: '',
        pruning: '',
        fertilization: '',
        price: '',
      });
    } catch (error) {
      console.error('Error adding bonsai:', error);
      setError('Failed to add bonsai.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Bonsai
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/bonsai/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBonsai((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting bonsai:', error);
      setError('Failed to delete bonsai.');
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>🌱 Manage Bonsai</h2>

      {/* ✅ Error Message Display */}
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {/* ✅ Add Bonsai Form */}
      <div className='bg-gray-100 p-4 mb-6 rounded'>
        <h3 className='font-semibold mb-2'>Add New Bonsai</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Name'
            className='border p-2 w-full mb-2'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Scientific Name'
            className='border p-2 w-full mb-2'
            value={formData.scientificName}
            onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Image URL'
            className='border p-2 w-full mb-2'
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
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
          <input
            type='text'
            placeholder='owner'
            className='border p-2 w-full mb-2'
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            required
          />{' '}
          <input
            type='text'
            placeholder='link'
            className='border p-2 w-full mb-2'
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />{' '}
          <input
            type='text'
            placeholder='age'
            className='border p-2 w-full mb-2'
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Watering'
            className='border p-2 w-full mb-2'
            value={formData.watering}
            onChange={(e) => setFormData({ ...formData, watering: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Sunlight'
            className='border p-2 w-full mb-2'
            value={formData.sunlight}
            onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Special Care'
            className='border p-2 w-full mb-2'
            value={formData.specialCare}
            onChange={(e) => setFormData({ ...formData, specialCare: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Pruning'
            className='border p-2 w-full mb-2'
            value={formData.pruning}
            onChange={(e) => setFormData({ ...formData, pruning: e.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Fertilization'
            className='border p-2 w-full mb-2'
            value={formData.fertilization}
            onChange={(e) => setFormData({ ...formData, fertilization: e.target.value })}
            required
          />
          <input
            type='number'
            placeholder='Price'
            className='border p-2 w-full mb-2'
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <button
            type='submit'
            className='bg-green-500 text-white px-4 py-2 rounded'
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Bonsai'}
          </button>
        </form>
      </div>

      {/* ✅ Display Bonsai */}
      <h3 className='text-lg font-semibold'>🌱 Bonsai</h3>
      {bonsai.map((item) => (
        <div
          key={item._id}
          className='p-4 bg-gray-100 rounded-lg mb-4 flex justify-between items-center'
        >
          <div>
            <p>
              <strong>Name:</strong> {item.name}
            </p>
            <p>
              <strong>Scientific Name:</strong> {item.scientificName}
            </p>
          </div>
          <button
            onClick={() => handleDelete(item._id)}
            className='text-red-500 hover:text-red-700'
          >
            <Trash2 className='h-5 w-5' />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminBonsai;
