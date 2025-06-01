// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: {
    displayName: string;
    email: string;
    photoURL?: string;
  } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-gray-900/90 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          ChatFold
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-10">
          {['Home', 'Folders', 'About'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/home' : `/${item.toLowerCase()}`}
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right section: User Profile Icon */}
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center space-x-2 focus:outline-none rounded-full"
            aria-label="User Profile"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-300" />
            )}
            <span className="hidden md:block text-gray-200 font-medium">
              {user?.displayName || 'Guest'}
            </span>
          </button>

          {/* Logout button */}
          {user && (
            <button
              onClick={onLogout}
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Logout</span>
            </button>
          )}

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 z-40 flex flex-col justify-center items-center md:hidden"
          >
            <motion.ul
              className="flex flex-col space-y-8 text-center"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {['Home', 'Folders', 'About'].map((item) => (
                <motion.li
                  key={item}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={item === 'Home' ? '/home' : `/${item.toLowerCase()}`}
                    className="text-2xl font-medium text-gray-100 hover:text-indigo-400 transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
              
              {/* Mobile Logout button */}
              {user && (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                    <span className="text-xl font-medium text-white">Logout</span>
                  </button>
                </motion.li>
              )}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
