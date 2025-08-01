import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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

const Payment: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const orderData = location.state?.orderData;
    if (orderData) {
      setCartItems(orderData.items);
    } else {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(storedCart);
    }
  }, [location.state]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handlePayment = async () => {
    setError(null);
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User authentication required. Please log in.');
      setIsProcessing(false);
      return;
    }

    const newOrder: Order = {
      _id: Math.random().toString(36).substr(2, 9), // Mock unique ID
      totalAmount,
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0],
      orderTime: new Date().toLocaleTimeString(),
      paymentMethod,
      items: cartItems,
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/orders`, newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/orders', { state: { orderData: newOrder } });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Select Payment Method</h2>
      <div>
        <label className='block mb-2'>
          <input type='radio' name='payment' value='UPI' onChange={() => setPaymentMethod('UPI')} />{' '}
          UPI
        </label>
        <label className='block mb-2'>
          <input
            type='radio'
            name='payment'
            value='Card'
            onChange={() => setPaymentMethod('Card')}
          />{' '}
          Debit/Credit Card
        </label>
        <label className='block mb-2'>
          <input type='radio' name='payment' value='COD' onChange={() => setPaymentMethod('COD')} />{' '}
          Cash on Delivery (COD)
        </label>
      </div>
      {error && <p className='text-red-500 mt-2'>{error}</p>}
      <button
        onClick={handlePayment}
        className={`bg-green-500 text-white px-6 py-3 rounded mt-4 w-full ${
          isProcessing && 'opacity-50 cursor-not-allowed'
        }`}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing Payment...' : 'Proceed to Pay'}
      </button>
    </div>
  );
};

export default Payment;
