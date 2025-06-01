// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/home';
import User from './pages/User';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/user" element={user ? <User user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/auth"} />} />
      </Routes>
    </Router>
  );
}
