import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';

export const ManageInventory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => navigate('/shop')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Manage Inventory</h1>
          </div>

          <div className="mb-8">
            <Settings className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              For full inventory management features, please visit the Admin Dashboard.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all text-lg"
          >
            Go to Admin Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};