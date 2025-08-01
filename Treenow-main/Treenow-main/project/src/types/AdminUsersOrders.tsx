import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsersOrders = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const usersRes = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/admin/users`, { headers });
        const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/admin/orders`, { headers });

        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Error fetching users & orders:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>👥 Users & 📦 Orders</h2>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <h3 className='text-lg font-semibold'>👥 Users</h3>
          {users.map((user) => (
            <div key={user._id} className='p-4 bg-gray-100 rounded-lg mb-4'>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          ))}
        </div>
        <div>
          <h3 className='text-lg font-semibold'>📦 Orders</h3>
          {orders.map((order) => (
            <div key={order._id} className='p-4 bg-gray-100 rounded-lg mb-4'>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersOrders;
