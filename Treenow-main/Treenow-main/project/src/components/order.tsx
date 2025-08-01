import { useState, useEffect } from 'react';
import axios from 'axios';


interface CheckoutItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  orderTime: string;
  paymentMethod: string;
  items: CheckoutItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<Order[]>(`${import.meta.env.VITE_BACKEND_SERVER}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Failed to fetch orders. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>All Orders</h2>
      {loading && <p className='text-gray-600'>Fetching orders...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {orders.length > 0 ? (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div key={order._id} className='border p-4 rounded shadow-md'>
              <p className='font-bold'>Order ID: {order._id}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Status: {order.status}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Order Date: {order.orderDate}</p>
              <p>Order Time: {order.orderTime}</p>
              <div className='mt-2'>
                <h3 className='font-semibold'>Items:</h3>
                {order.items.map((item) => (
                  <div key={item._id} className='flex items-center gap-4 border p-2 rounded mt-2'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-16 h-16 object-cover rounded'
                    />
                    <div>
                      <p className='font-semibold'>{item.name}</p>
                      <p className='text-green-600 font-bold'>
                        ₹{item.price} × {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-600'>No orders found.</p>
      )}
    </div>
  );
};


export default Orders;
