import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BonsaiPage from './components/BonsaiCare';
import TreeCarePage from './components/TreeCarePage';
import KisanHelp from './components/Kisanhelp';
import KisanNewspaper from './components/Blog';
import Login from './pages/Login';
import Signup from './pages/Sineup';
import Profile from './pages/profile';
import AdminDashboard from './types/AdminDashboard';
import AdminOrders from './types/AdminOrders';
import AdminUsersOrders from './types/AdminUsersOrders';
import AdminProductsOrders from './types/AdminProducts';
import AdminTree from './types/AdminTree';
import AdminBonsai from './types/AdminBonsai';
import AdminDiseaseForm from './types/AdminDiseaseForm';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/checkout';
import Cart from './components/cart';
import Payment from './pages/payment';
import Orders from './components/order';
import Products from './components/Product';
 
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            });
          setUser(data); // Store user details
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token'); // Remove token if invalid
          setUser(null);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        {/* Pass user data to Navbar */}
        <Navbar user={user} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tree-care' element={<TreeCarePage />} />
          <Route path='/bonsai' element={<BonsaiPage />} />
          <Route path='/krishi-help' element={<KisanHelp />} />
          <Route path='/krishi-help/:diseaseId' element={<KisanHelp />} />
          <Route path='/products' element={<Products />} />
          <Route path='/blog' element={<KisanNewspaper />} />
          <Route path='/contact' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile user={user} />} />
          <Route path='/order' element={<Orders />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          {/* ✅ User Order Route */}
          <Route path='/orders' element={user ? <Orders /> : <Navigate to='/login' />} />

          {/* ✅ Admin Routes */}
          <Route
            path='/admin'
            element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to='/' />}
          />
          <Route
            path='/admin/orders'
            element={user && user.isAdmin ? <AdminOrders /> : <Navigate to='/' />}
          />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/trees' element={<AdminTree />} />
          <Route path='/admin/bonsai' element={<AdminBonsai />} />
          <Route path='/admin/users-orders' element={<AdminUsersOrders />} />
          <Route path='/admin/disease' element={<AdminDiseaseForm />} />
          <Route path='/admin/products' element={<AdminProductsOrders />} />
          <Route path='/admin/order' element={<AdminOrders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
