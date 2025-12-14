import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Candy, Menu, X, User, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', show: true },
    { path: '/shop', label: 'Shop', show: true },
    { path: '/dashboard', label: 'Dashboard', show: isAuthenticated && !isAdmin },
    { path: '/admin', label: 'Admin', show: isAuthenticated && isAdmin },
  ];

  return (
    <nav className="bg-white shadow-md border-b-4 border-pink-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Candy className="w-8 h-8 text-pink-500" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              SweetShop
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(
              (link) =>
                link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-semibold transition-colors relative ${
                      isActive(link.path)
                        ? 'text-pink-600'
                        : 'text-gray-700 hover:text-pink-600'
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-600"
                      />
                    )}
                  </Link>
                )
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border-2 border-pink-200">
                  {isAdmin ? (
                    <Shield className="w-4 h-4 text-purple-600" />
                  ) : (
                    <User className="w-4 h-4 text-pink-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs font-bold text-purple-600">
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-2 border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map(
                (link) =>
                  link.show && (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                        isActive(link.path)
                          ? 'bg-pink-100 text-pink-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
              )}

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border-2 border-pink-200">
                    <div className="flex items-center gap-2 mb-2">
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-pink-600" />
                      )}
                      <span className="font-semibold text-gray-800">{user?.name}</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-bold text-purple-600">
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-center text-gray-700 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
