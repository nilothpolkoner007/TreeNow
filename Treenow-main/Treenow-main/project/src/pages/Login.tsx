import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  setUser: (user: any) => void;
}

const Login: React.FC<Props> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/users/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('token', data.token); 
      setUser(data);

     
      if (data.isAdmin) {
        navigate('/admin'); 
      } else if (data.isAdmin === false) {
        navigate('/');
      } else {
        navigate('/login'); 
      }

    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid email or password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleLogin} className='w-1/3 space-y-4'>
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
        <button
          className='bg-blue-500 text-white px-4 py-2 w-full'
          type='submit'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className='mt-4'>
        Don't have an account?{' '}
        <a href='/signup' className='text-blue-500'>
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
