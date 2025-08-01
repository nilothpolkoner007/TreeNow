import React from 'react';
import { Leaf, Sprout, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className='relative bg-emerald-800 text-white'>
      <div className='absolute inset-0'>
        <img
          src='https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=2000'
          alt='Nature background'
          className='w-full h-full object-cover opacity-20'
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
            Nurturing Nature, Growing Together
          </h1>
          <p className='mt-6 text-xl text-emerald-100 max-w-3xl mx-auto'>
            Your comprehensive resource for tree care, bonsai artistry, and innovative agricultural
            solutions.
          </p>
          <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto'>
            <Link
              to='/tree-care'
              className='flex items-center justify-center space-x-2 rounded-lg bg-white px-6 py-4 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors'
            >
              <Leaf className='h-5 w-5' />
              <span>Tree Care</span>
            </Link>
            <Link
              to='/bonsai'
              className='flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 px-6 py-4 text-white font-semibold hover:bg-emerald-500 transition-colors'
            >
              <Sprout className='h-5 w-5' />
              <span>Bonsai Care</span>
            </Link>
            <Link
              to='/krishi-help'
              className='flex items-center justify-center space-x-2 rounded-lg bg-emerald-700 px-6 py-4 text-white font-semibold hover:bg-emerald-600 transition-colors'
            >
              <Wheat className='h-5 w-5' />
              <span>Krishi Help</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
