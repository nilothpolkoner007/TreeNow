import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Sprout,
  Wheat,
  BookOpen,
  Phone,
  TreePine,
  LogOut,
  LogIn,
} from 'lucide-react';
import axios from 'axios';
const navLinks = [
  { to: '/tree-care', label: 'Tree Care', icon: <TreePine className='h-5 w-5' /> },
  { to: '/bonsai', label: 'Bonsai Care', icon: <Sprout className='h-5 w-5' /> },
  { to: '/krishi-help', label: 'Krishi Help', icon: <Wheat className='h-5 w-5' /> },
  { to: '/products', label: 'Products' },
  { to: '/blog', label: 'Blog', icon: <BookOpen className='h-5 w-5' /> },
  { to: '/Profile', label: 'Profile', icon: <Phone className='h-5 w-5' /> },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setUser(token);
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get('http://localhost:5001/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className='bg-emerald-700 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <TreePine className='h-8 w-8' />
            <span className='text-xl font-bold'>TreeCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className='hover:text-emerald-200 transition-colors flex items-center space-x-1'
              >
                {icon} <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className='flex items-center space-x-4'>
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className='p-2 hover:bg-emerald-600 rounded-full'
            >
              <Search className='h-5 w-5' />
            </button>

            {/* Cart */}
            <Link to='/cart' className='relative hover:text-emerald-200 transition-colors'>
              <ShoppingCart className='h-6 w-6' />
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                0
              </span>
            </Link>

            {/* User Account / Login & Logout */}
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className='flex items-center space-x-1 hover:text-red-300 transition-colors'
                >
                  <LogOut className='h-6 w-6' />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='flex items-center space-x-1 hover:text-emerald-200 transition-colors'
                >
                  <LogIn className='h-6 w-6' />
                  <span>Login</span>
                </Link>
                <Link
                  to='/signup'
                  className='bg-white text-emerald-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition'
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 hover:bg-emerald-600 rounded-full'
            >
              {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className='py-4 border-t border-emerald-600'>
            <div className='max-w-3xl mx-auto relative'>
              <input
                type='text'
                placeholder='Search articles, products, or resources...'
                className='w-full px-4 py-2 rounded-lg bg-emerald-800 text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300'
              />
              <Search className='absolute right-12 top-2.5 h-5 w-5 text-emerald-300' />
              <button
                onClick={() => setIsSearchOpen(false)}
                className='absolute right-3 top-2.5 text-emerald-300 hover:text-white'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden border-t border-emerald-600'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className='block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600'
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div className='relative group'>
                <button className='flex items-center space-x-2 hover:text-emerald-200 transition-colors'>
                
                </button>

                {/* Dropdown menu */}
                <div className='absolute hidden group-hover:block right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg'>
                  <Link to='/profile' className='block px-4 py-2 hover:bg-gray-100'>
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to='/login'
                  className='flex items-center space-x-1 hover:text-emerald-200 transition-colors'
                >
                  <LogIn className='h-6 w-6' />
                  <span>Login</span>
                </Link>
                <Link
                  to='/signup'
                  className='bg-white text-emerald-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
