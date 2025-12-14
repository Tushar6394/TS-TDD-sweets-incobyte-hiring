import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const categories = [
  { name: 'Cake', description: 'Delicious cakes for every occasion' },
  { name: 'Candy', description: 'Sweet candies and treats' },
  { name: 'Chocolate', description: 'Premium chocolate products' },
  { name: 'Lollipop', description: 'Colorful lollipops and suckers' },
  { name: 'Cookie', description: 'Fresh baked cookies' },
];

export const ManageCategories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/shop')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-2xl border-2 border-pink-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Categories are currently managed by the development team.
              Contact support to add new categories.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};