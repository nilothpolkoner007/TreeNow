import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/api/users/register`, { name, email, password });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setError('Signup failed. Try again.');
       console.log(error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Sign Up</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleSignup} className='w-1/3 space-y-4'>
        <input
          className='border p-2 w-full'
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className='border p-2 w-full'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='border p-2 w-full'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='bg-green-500 text-white px-4 py-2 w-full' type='submit'>
          Sign Up
        </button>
      </form>
      <p className='mt-4'>
        Already have an account?{' '}
        <a href='/login' className='text-green-500'>
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;
