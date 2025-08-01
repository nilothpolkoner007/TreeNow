import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

type Order = {
  _id: string;
  user?: { name?: string };
  totalAmount: number;
  status: string;
  [key: string]: any; // Add this if there are other dynamic fields
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessages, setActionMessages] = useState<{ [key: string]: string }>({});
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusOptions = ['Shipped', 'On Going', 'Cancel', 'Ready', 'Arriving Today', 'Completed'];

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_SERVER}/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  }, []);

  const handleActionMessageSubmit = async (orderId) => {
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_SERVER}/admin/orders/${orderId}`,
        { actionMessage: actionMessages[orderId] || '' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert('Action message updated successfully!');
    } catch (error) {
      console.error('Error updating action message:', error);
      setError('Failed to update action message.');
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order.');
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Admin Orders</h2>
      {error && <p className='text-red-500'>{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>Order ID</th>
              <th className='border p-2'>Customer</th>
              <th className='border p-2'>Total Amount</th>
              <th className='border p-2'>Status</th>
              <th className='border p-2'>Action Message</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className='text-center'>
                <td className='border p-2'>{order._id}</td>
                <td className='border p-2'>{order.user?.name || 'Guest'}</td>
                <td className='border p-2'>₹{order.totalAmount.toFixed(2)}</td>
                <td className='border p-2'>
                  <select
                    className='border p-2 rounded'
                    value={typeof order.status === 'string' ? order.status : ''}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updating[order._id]}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className='border p-2'>
                  <input
                    type='text'
                    className='border p-2 rounded w-full'
                    value={actionMessages[order._id] || ''}
                    onChange={(e) =>
                      setActionMessages((prev) => ({ ...prev, [order._id]: e.target.value }))
                    }
                    placeholder='Enter action message'
                  />
                  <button
                    onClick={() => handleActionMessageSubmit(order._id)}
                    className='bg-blue-500 text-white px-2 py-1 mt-2 rounded w-full'
                    disabled={updating[order._id]}
                  >
                    {updating[order._id] ? 'Updating...' : 'Update Message'}
                  </button>
                </td>
                <td className='border p-2 space-x-2'>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                    disabled={updating[order._id]}
                  >
                    {updating[order._id] ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
