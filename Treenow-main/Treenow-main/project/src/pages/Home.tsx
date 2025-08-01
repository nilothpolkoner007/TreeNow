import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     const token = localStorage.getItem('token'); // Get the token from localStorage (or context)

     axios
       .get(`${import.meta.env.VITE_BACKEND_SERVER}/api/products`, {
         headers: {
           Authorization: `Bearer ${token}`, // Send token in the header
         },
       })
       .then((response) => {
         setProducts(response.data);
         setError(null);
       })
       .catch((error) => {
         console.error('Error fetching products:', error);
         setError('Unauthorized access. Please log in.');
       })
       .finally(() => setLoading(false));
   }, []);

  const handleAddToCart = async (product: Product, type: 'wait' | 'packet') => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/api/cart/add`, {
        productId: product.id,
        type,
        quantity: 1,
      });
      console.log('Added to cart:', product.name);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div>
      <Hero />

      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-8'>Featured Products</h2>

        {loading && <p className='text-center text-gray-600'>Loading products...</p>}
        {error && <p className='text-center text-red-500'>{error}</p>}

        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {products.map((product) => (
              <div
                key={product.id}
                className='border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between'
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-48 w-full object-cover rounded-md'
                />
                <div className='mt-4'>
                  <h3 className='text-lg font-bold text-gray-900'>{product.name}</h3>
                  <p className='text-gray-700 text-sm mt-1'>{product.description}</p>
                  <p className='text-green-600 font-semibold mt-2'>${product.price}</p>
                </div>
                <div className='mt-4 flex justify-between'>
                  <button
                    onClick={() => handleAddToCart(product, 'wait')}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                  >
                    Add to Cart (Wait)
                  </button>
                  <button
                    onClick={() => handleAddToCart(product, 'packet')}
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                  >
                    Add to Cart (Packet)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className='bg-emerald-50 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Expert Plant Diagnosis</h2>
            <p className='text-lg text-gray-600 mb-8'>
              Use our AI-powered tool to identify plant issues and get personalized care
              recommendations.
            </p>
            <img
              src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200'
              alt='Plant diagnosis'
              className='rounded-lg shadow-lg mx-auto'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
