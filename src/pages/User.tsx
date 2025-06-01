// src/pages/User.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

interface UserProps {
  user: {
    displayName: string;
    email: string;
    photoURL?: string;
  } | null;
  onLogout: () => void;
}

const User: React.FC<UserProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <UserCircle className="w-24 h-24 mx-auto mb-4 text-gray-400" />
        )}
        <h2 className="text-2xl font-semibold">{user?.displayName || 'Guest User'}</h2>
        <p className="text-gray-400 mt-2">{user?.email || 'No Email'}</p>

        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;
