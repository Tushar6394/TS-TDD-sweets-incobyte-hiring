import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sweetsApi } from '../services/api';
import { Sweet, SearchParams } from '../types';
import { SweetCard } from '../components/SweetCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const categories = ['all', 'cake', 'candy', 'chocolate', 'lollipop', 'cookie'];

export const Shop = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterAndSortSweets();
  }, [sweets, selectedCategory, sortBy]);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch (error) {
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    if (!params.q && !params.priceMin && !params.priceMax) {
      setFilteredSweets(sweets);
      return;
    }

    try {
      setIsLoading(true);
      const data = await sweetsApi.search(params);
      setFilteredSweets(data.sweets);
    } catch (error) {
      showToast('Search failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortSweets = () => {
    let filtered = selectedCategory === 'all'
      ? sweets
      : sweets.filter((sweet) => sweet.category === selectedCategory);

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

    setFilteredSweets(filtered);
  };

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

  if (isLoading && sweets.length === 0) {
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
          <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">Sweet Shop</h1>
          <p className="text-gray-600 text-center text-lg mb-8">
            Browse our delicious collection of treats
          </p>
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

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

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No sweets found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredSweets.map((sweet, index) => (
              <motion.div
                key={sweet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SweetCard sweet={sweet} onPurchase={handlePurchase} isAdmin={false} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
