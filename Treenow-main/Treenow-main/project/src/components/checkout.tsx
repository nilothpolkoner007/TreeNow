import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface CheckoutItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product || null;
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    const items: CheckoutItem[] = product
      ? [product]
      : JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);

    const totalPrice = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    setTotal(totalPrice);
    setFinalAmount(totalPrice);
  }, [product]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setUserLocation(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`),
        (error) => console.error('Error fetching location:', error),
      );
    }
  }, []);

  const applyCoupon = () => {
    if (coupon === 'DISCOUNT10') {
      const discountAmount = total * 0.1;
      setDiscount(discountAmount);
      setFinalAmount(total - discountAmount);
    } else {
      alert('Invalid coupon code');
    }
  };

  // Navigate to Payment Page with order data
  const handlePayment = () => {
    const orderData = {
      items: cartItems,
      totalAmount: finalAmount,
      discount: discount,
      userLocation: userLocation,
      status: 'Pending',
      orderDate: new Date().toISOString(),
    };

    navigate('/payment', { state: { orderData } });
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl font-bold'>Checkout</h2>

      <div className='mt-4'>
        <h3 className='text-xl font-semibold'>Your Items</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className='flex items-center gap-4 border p-2 rounded mt-2'>
              <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded' />
              <div>
                <p className='font-semibold'>{item.name}</p>
                <p className='text-green-600 font-bold'>
                  ₹{item.price} × {item.quantity || 1}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-600'>No items in checkout.</p>
        )}
      </div>

      <div className='mt-4'>
        <h3 className='text-xl font-semibold'>Delivery Location</h3>
        <p className='text-gray-600'>{userLocation || 'Fetching location...'}</p>
      </div>

      <div className='mt-4'>
        <h3 className='text-xl font-semibold'>Apply Coupon</h3>
        <input
          type='text'
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className='border p-2 w-full rounded mt-2'
          placeholder='Enter coupon code'
        />
        <button onClick={applyCoupon} className='bg-blue-500 text-white px-4 py-2 rounded mt-2'>
          Apply Coupon
        </button>
      </div>

      <div className='mt-4'>
        <h3 className='text-xl font-semibold'>Final Amount</h3>
        <p className='text-gray-600'>Total: ₹{total}</p>
        {discount > 0 && <p className='text-red-500'>Discount: -₹{discount}</p>}
        <p className='text-green-600 font-bold text-xl'>Final: ₹{finalAmount}</p>
      </div>

      <button
        className='bg-green-500 text-white px-6 py-3 rounded mt-4 w-full'
        onClick={handlePayment}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
