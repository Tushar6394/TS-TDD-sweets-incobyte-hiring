import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Manage your account and view your activity</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-pink-100 to-pink-50 p-6 rounded-2xl border-2 border-pink-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-pink-500 p-3 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Profile</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {user?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Role:</span>{' '}
                  <span className="capitalize">{user?.role}</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl border-2 border-purple-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500 p-3 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Orders</h3>
              </div>
              <p className="text-gray-600 mb-4">View your purchase history and track orders</p>
              <Link
                to="/shop"
                className="inline-block px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
              >
                Browse Shop
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl border-2 border-blue-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Favorites</h3>
              </div>
              <p className="text-gray-600 mb-4">Save your favorite sweets for quick access</p>
              <Link
                to="/shop"
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Explore Sweets
              </Link>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for more sweets?</h2>
            <p className="text-lg mb-6 opacity-90">
              Discover new treats and exclusive offers in our shop
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Visit Shop
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
