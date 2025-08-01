import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProductsOrders = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'products' | 'orders'>('products');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    use: '', // ✅ Ensuring 'use' field exists
    image: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch Products & Orders with Token
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: Please login as an admin.');
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/products`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/orders`, { headers }),
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add New Product with Token Validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: Please login as an admin.');

    const productData = {
      ...formData,
      price: Number(formData.price),
      use: Number(formData.use),
    };

    if (isNaN(productData.use) || productData.use <= 0) {
      return alert('Use value must be a valid number greater than zero');
    }

    if (isNaN(productData.price) || productData.price <= 0) {
      return alert('Price must be a valid number greater than zero');
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/api/products`, productData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setProducts([...products, data]);
      setFormData({ name: '', category: '', use: '', image: '', description: '', price: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'Failed to add product');
    }
  };



  // ✅ Delete Product with Token Validation
  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: Please login as an admin.');

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || '❌ Failed to delete product.');
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>🛍️ Admin - Products & Orders</h2>

      {/* ✅ Toggle Buttons */}
      <div className='mb-6 flex space-x-4'>
        <button
          className={`px-4 py-2 rounded ${
            view === 'products' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('products')}
        >
          🛍️ Products
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('orders')}
        >
          📦 Orders
        </button>
      </div>

      {loading ? <p className='text-center text-lg'>Loading...</p> : null}

      {/* ✅ Show Products Section */}
      {view === 'products' && (
        <>
          <div className='bg-gray-100 p-4 mb-6 rounded'>
            <h3 className='font-semibold mb-2'>Add New Product</h3>
            <form onSubmit={handleSubmit}>
              {['name', 'category', 'use', 'image', 'description', 'price'].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={field === 'price' ? 'number' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className='border p-2 w-full mb-2'
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                />
              ))}
              <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>
                Add Product
              </button>
            </form>
          </div>

          {/* ✅ Product List */}
          {products?.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className='p-4 bg-gray-100 rounded-lg mb-4'>
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Use:</strong> {product.use}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price}
                </p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className='bg-red-500 text-white px-3 py-1 rounded mt-2'
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductsOrders;
