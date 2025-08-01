import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
}

export default function KisanNewspaper() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/blogs`);
        setBlogs(response.data);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className='text-center text-gray-600'>Loading...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-center text-green-700 mb-6'>🌾 Kisan Newspaper</h1>
      <p className='text-center text-gray-600 mb-8'>
        Get the latest updates on weather, crop prices, and agriculture tips.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {blogs.map((blog) => (
          <div key={blog._id} className='bg-white shadow-lg p-4 rounded-lg'>
            <img
              src={blog.image}
              alt={blog.title}
              className='rounded-lg h-40 w-full object-cover'
            />
            <h3 className='text-xl font-semibold mt-2'>{blog.title}</h3>
            <p className='text-sm text-gray-500'>{blog.category}</p>
            <p className='text-gray-700 mt-2'>{blog.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
