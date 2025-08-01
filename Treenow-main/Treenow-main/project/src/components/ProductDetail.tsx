import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  quantity?: number; // Added quantity for cart management
}

export default function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_SERVER}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('❌ Error fetching product:', error);
        setError('Failed to fetch product. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_SERVER}/products/category/${product.category}`)
      .then((response) => setSuggestedProducts(response.data))
      .catch((error) => console.error('❌ Error fetching suggestions:', error));
  }, [product?.category]);

  const addToCart = () => {
    if (!product) return;

    const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      // If product exists, increase its quantity
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      // Otherwise, add a new entry with quantity 1
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart'); // Redirect to cart after adding
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate('/checkout', { state: { product } });
  };

  if (loading) return <p className='text-center text-gray-600 text-lg'>🔄 Loading product...</p>;
  if (error) return <p className='text-center text-red-500 text-lg'>{error}</p>;

  return (
    <div className='max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg'>
      {product && (
        <>
          <h2 className='text-3xl font-bold text-gray-800'>{product.name}</h2>
          <img
            src={product.image}
            alt={product.name}
            className='w-full max-h-72 object-cover mt-4 rounded-lg shadow-md'
          />
          <p className='mt-4 text-gray-700 text-lg'>{product.description}</p>
          <p className='mt-4 text-green-700 font-bold text-2xl'>💰 ₹{product.price}</p>

          <div className='mt-6 flex gap-4'>
            <button
              className='bg-orange-500 text-white px-5 py-3 rounded-lg hover:bg-orange-600 transition'
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>
            <button
              className='bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition'
              onClick={handleBuyNow}
            >
              🚀 Buy Now
            </button>
          </div>

          <h3 className='mt-8 text-2xl font-semibold text-gray-800'>Similar Products</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mt-4'>
            {suggestedProducts.length > 0 ? (
              suggestedProducts.map((item) => (
                <div
                  key={item._id}
                  className='border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer'
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-full h-36 object-cover rounded-lg shadow'
                  />
                  <p className='text-lg font-semibold mt-2 text-gray-800'>{item.name}</p>
                  <p className='text-green-600 font-bold'>₹{item.price}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No similar products found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
