import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sweetsApi } from '../services/api';
import { Sweet } from '../types';
import { SweetCard } from '../components/SweetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const categories = ['cake', 'candy', 'chocolate', 'lollipop', 'cookie'];

export const CategoryShop = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!category || !categories.includes(category)) {
      navigate('/shop');
      return;
    }
    fetchSweets();
  }, [category]);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const data = await sweetsApi.getAll();
      const filtered = data.filter((sweet: Sweet) => sweet.category === category);
      setSweets(filtered);
    } catch (error) {
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedSweets = [...sweets].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const handlePurchase = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      showToast('Please login to purchase', 'error');
      return;
    }

    try {
      await sweetsApi.purchase(id, { quantity });
      showToast('Purchase successful!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/shop')}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to All Sweets
          </button>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center capitalize">
            {category} Collection
          </h1>
          <p className="text-gray-600 text-center text-lg mb-8">
            Discover our delicious {category} treats
          </p>
        </motion.div>

        <div className="mb-6 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white font-semibold"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {sortedSweets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No {category} sweets available</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Browse All Sweets
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedSweets.map((sweet, index) => (
              <motion.div
                key={sweet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SweetCard sweet={sweet} isAdmin={false} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};