import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, AlertTriangle, Candy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sweetsApi } from '../services/api';
import { Sweet, CreateSweetRequest, UpdateSweetRequest } from '../types';
import { SweetCard } from '../components/SweetCard';
import { SweetFormModal } from '../components/SweetFormModal';
import { RestockModal } from '../components/RestockModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null);
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

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

  const handleAddSweet = async (data: CreateSweetRequest) => {
    try {
      await sweetsApi.create(data);
      showToast('Sweet added successfully!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to add sweet', 'error');
    }
  };

  const handleEditSweet = async (data: UpdateSweetRequest) => {
    if (!selectedSweet) return;

    try {
      await sweetsApi.update(selectedSweet._id, data);
      showToast('Sweet updated successfully!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to update sweet', 'error');
    }
  };

  const handleDeleteSweet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsApi.delete(id);
      showToast('Sweet deleted successfully', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to delete sweet', 'error');
    }
  };

  const handleRestock = async (quantity: number) => {
    if (!restockSweet) return;

    try {
      await sweetsApi.restock(restockSweet._id, { quantity });
      showToast(`Restocked ${restockSweet.name} successfully!`, 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to restock', 'error');
    }
  };

  const openAddModal = () => {
    setSelectedSweet(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const sweet = sweets.find((s) => s._id === id);
    if (sweet) {
      setSelectedSweet(sweet);
      setIsModalOpen(true);
    }
  };

  const openRestockModal = (id: string) => {
    const sweet = sweets.find((s) => s._id === id);
    if (sweet) {
      setRestockSweet(sweet);
      setIsRestockModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const lowStockSweets = sweets.filter((s) => s.quantity < 10);
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, s) => sum + s.price * s.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-pink-500 p-3 rounded-full">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Sweets</p>
                <p className="text-3xl font-bold text-gray-800">{totalSweets}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-amber-500 p-3 rounded-full">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Inventory Value</p>
                <p className="text-3xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-red-500 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-800">{lowStockSweets.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Manage Inventory</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Sweet
          </motion.button>
        </div>

        {lowStockSweets.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert
            </h3>
            <div className="space-y-2">
              {lowStockSweets.map((sweet) => (
                <div
                  key={sweet._id}
                  className="flex items-center justify-between bg-white rounded-lg p-3"
                >
                  <span className="font-semibold text-gray-800">{sweet.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 font-bold">{sweet.quantity} left</span>
                    <button
                      onClick={() => openRestockModal(sweet._id)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet, index) => (
              <motion.div
                key={sweet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SweetCard
                  sweet={sweet}
                  onEdit={openEditModal}
                  onDelete={handleDeleteSweet}
                  isAdmin={true}
                />
                <button
                  onClick={() => openRestockModal(sweet._id)}
                  className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Restock
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <SweetFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSweet(null);
          }}
          onSubmit={selectedSweet ? handleEditSweet : handleAddSweet}
          sweet={selectedSweet}
        />

        <RestockModal
          isOpen={isRestockModalOpen}
          onClose={() => {
            setIsRestockModalOpen(false);
            setRestockSweet(null);
          }}
          onSubmit={handleRestock}
          sweetName={restockSweet?.name || ''}
          currentStock={restockSweet?.quantity || 0}
        />
      </div>
    </div>
  );
};
