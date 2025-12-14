import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { sweetsApi } from '../services/api';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showToast('Please login to checkout', 'error');
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Purchase all items in cart
      for (const item of items) {
        await sweetsApi.purchase(item.sweet._id, { quantity: item.quantity });
      }
      showToast('Order placed successfully!', 'success');
      clearCart();
      navigate('/dashboard');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 text-center"
          >
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious sweets to get started!</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Browse Sweets
            </button>
          </motion.div>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          </div>

          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <motion.div
                key={item.sweet._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200"
              >
                <img
                  src={item.sweet.imageUrl || `https://via.placeholder.com/100x100/FF69B4/FFFFFF?text=${item.sweet.category}`}
                  alt={item.sweet.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.sweet.name}</h3>
                  <p className="text-gray-600">${item.sweet.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.sweet._id, item.quantity - 1)}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.sweet._id, item.quantity + 1)}
                    disabled={item.quantity >= item.sweet.quantity}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ${(item.sweet.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.sweet._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-pink-600">${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};