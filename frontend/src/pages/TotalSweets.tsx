import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { sweetsApi } from '../services/api';
import { Sweet } from '../types';
import { useToast } from '../contexts/ToastContext';

export const TotalSweets = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch (error) {
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSweets = sweets.length;
  const totalQuantity = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-800">Total Sweets Inventory</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl border-2 border-blue-200 text-center"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-2">{totalSweets}</h3>
              <p className="text-blue-600 font-semibold">Total Products</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl border-2 border-green-200 text-center"
            >
              <h3 className="text-2xl font-bold text-green-800 mb-2">{totalQuantity}</h3>
              <p className="text-green-600 font-semibold">Total Quantity</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-200 text-center"
            >
              <h3 className="text-2xl font-bold text-purple-800 mb-2">${totalValue.toFixed(2)}</h3>
              <p className="text-purple-600 font-semibold">Total Value</p>
            </motion.div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-2 border-gray-200 p-3 text-left font-bold">Name</th>
                  <th className="border-2 border-gray-200 p-3 text-left font-bold">Category</th>
                  <th className="border-2 border-gray-200 p-3 text-left font-bold">Price</th>
                  <th className="border-2 border-gray-200 p-3 text-left font-bold">Quantity</th>
                  <th className="border-2 border-gray-200 p-3 text-left font-bold">Value</th>
                </tr>
              </thead>
              <tbody>
                {sweets.map((sweet) => (
                  <tr key={sweet._id} className="hover:bg-gray-50">
                    <td className="border-2 border-gray-200 p-3">{sweet.name}</td>
                    <td className="border-2 border-gray-200 p-3 capitalize">{sweet.category}</td>
                    <td className="border-2 border-gray-200 p-3">${sweet.price.toFixed(2)}</td>
                    <td className="border-2 border-gray-200 p-3">{sweet.quantity}</td>
                    <td className="border-2 border-gray-200 p-3">${(sweet.price * sweet.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};