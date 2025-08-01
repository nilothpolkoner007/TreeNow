import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

 useEffect(() => {
   const token = localStorage.getItem('token'); 

   axios
     .get(`${import.meta.env.VITE_BACKEND_SERVER}/products`, {
       headers: {
         Authorization: `Bearer ${token}`, 
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <p className='text-center'>Loading...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <h2 className='text-3xl font-bold text-center mb-6'>🛍️ All Products</h2>

     
      <input
        type='text'
        placeholder='🔍 Search products...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full p-2 border rounded-md mb-4'
      />

      {/* Product Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className='border rounded p-4 shadow cursor-pointer hover:shadow-lg transition'
            onClick={() => navigate(`/products/${product._id}`)} // Navigate to product detail page
          >
            <img
              src={product.image}
              alt={product.name}
              className='w-full h-40 object-cover rounded'
            />
            <p className='text-lg font-semibold mt-2'>{product.name}</p>
            <p className='text-green-600 font-bold'>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
