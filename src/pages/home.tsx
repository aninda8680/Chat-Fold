import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


export default function HomePage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen min-w-screen p-4 dark bg-gray-900 text-white">
      

      <div className="flex flex-col items-center justify-center pt-40">
        <h1 className="text-4xl font-bold mb-6">Welcome to ChatFold 👋</h1>
        <p className="mb-8">You're logged in successfully.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
