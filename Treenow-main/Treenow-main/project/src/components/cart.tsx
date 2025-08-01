import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout', { state: { cart: cartItems } });
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
      <h2 className='text-3xl font-bold text-gray-800'>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className='text-center mt-6'>
          <p className='text-gray-600 text-lg'>Your cart is empty. Start shopping now!</p>
          <button
            onClick={() => navigate('/')}
            className='mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition'
          >
            🛍 Shop Now
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-4 border p-3 rounded-lg mt-4 bg-white shadow-sm'
            >
              <img src={item.image} alt={item.name} className='w-20 h-20 object-cover rounded-lg' />
              <div className='flex-1'>
                <p className='font-semibold text-lg text-gray-800'>{item.name}</p>
                <p className='text-green-600 font-bold text-xl'>₹{item.price}</p>
                <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className='border p-2 w-20 rounded-lg mt-2'
                  min='1'
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <div className='mt-6 border-t pt-4'>
            <h3 className='text-2xl font-semibold text-gray-800'>Total: ₹{totalAmount}</h3>
            <button
              onClick={proceedToCheckout}
              className={`w-full px-6 py-3 mt-4 text-white rounded-lg ${
                cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 transition'
              }`}
              disabled={cartItems.length === 0}
            >
              ✅ Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
