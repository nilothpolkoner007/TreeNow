import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Admin Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Link
          to='/admin/trees'
          className='p-6 bg-green-500 text-white rounded-lg text-center hover:bg-green-600'
        >
          🌲 Manage Trees
        </Link>
        <Link
          to='/admin/bonsai'
          className='p-6 bg-green-500 text-white rounded-lg text-center hover:bg-green-600'
        >
          🌲 Manage Bonsai
        </Link>
        <Link
          to='/admin/users-orders'
          className='p-6 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600'
        >
          👥 Users & 📦 Orders
        </Link>
        <Link
          to='/admin/disease'
          className='p-6 bg-orange-500 text-white rounded-lg text-center hover:bg-red-600'
        >
          🌱 Manage disease
        </Link>
        <Link
          to='/admin/products'
          className='p-6 bg-orange-500 text-white rounded-lg text-center hover:bg-orange-600'
        >
          🛍️ Manage Products
        </Link>
        <Link
          to='/admin/order'
          className='p-6 bg-orange-500 text-white rounded-lg text-center hover:bg-orange-600'
        >
          🛍️ Manage disease
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
