import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      {user ? (
        <div className='border p-4 rounded-lg shadow-lg text-center'>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}
          </p>
          <button
            className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
