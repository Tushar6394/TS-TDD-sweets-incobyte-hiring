import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import { sweetsApi } from '../services/api';
import { Sweet } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const categoryColors = {
  cake: 'bg-pink-100 text-pink-700 border-pink-300',
  candy: 'bg-purple-100 text-purple-700 border-purple-300',
  chocolate: 'bg-amber-100 text-amber-700 border-amber-300',
  lollipop: 'bg-blue-100 text-blue-700 border-blue-300',
  cookie: 'bg-orange-100 text-orange-700 border-orange-300',
};

const getPlaceholderImage = (category: string) => {
  const colors = {
    cake: 'FF69B4',
    candy: '9B59B6',
    chocolate: 'D2691E',
    lollipop: '4169E1',
    cookie: 'FF8C00',
  };
  const color = colors[category as keyof typeof colors] || 'FF69B4';
  return `https://via.placeholder.com/600x400/${color}/FFFFFF?text=${category}`;
};

export const SweetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSweet(id);
    }
  }, [id]);

  const fetchSweet = async (sweetId: string) => {
    try {
      setIsLoading(true);
      const data = await sweetsApi.getById(sweetId);
      setSweet(data);
    } catch (error) {
      showToast('Failed to load sweet details', 'error');
      navigate('/shop');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      showToast('Please login to purchase', 'error');
      navigate('/login');
      return;
    }

    if (!sweet || !id) return;

    try {
      setIsPurchasing(true);
      await sweetsApi.purchase(id, { quantity });
      showToast(`Successfully purchased ${quantity} ${sweet.name}!`, 'success');
      fetchSweet(id);
      setQuantity(1);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const incrementQuantity = () => {
    if (sweet && quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!sweet) {
    return null;
  }

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-96 lg:h-full bg-gradient-to-br from-pink-100 to-purple-100">
              <img
                src={sweet.imageUrl || getPlaceholderImage(sweet.category)}
                alt={sweet.name}
                className="w-full h-full object-cover"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">Out of Stock</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                    categoryColors[sweet.category]
                  }`}
                >
                  {sweet.category}
                </span>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{sweet.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{sweet.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-bold text-pink-600">
                  ${sweet.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-6 h-6" />
                  <span className={`text-lg font-semibold ${isOutOfStock ? 'text-red-600' : ''}`}>
                    {sweet.quantity} in stock
                  </span>
                </div>
              </div>

              {!isOutOfStock && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity === 1}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg font-bold text-xl transition-colors"
                    >
                      <Minus className="w-5 h-5 mx-auto" />
                    </button>
                    <span className="text-2xl font-bold text-gray-800 w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= sweet.quantity}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg font-bold text-xl transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Total: <span className="font-bold text-pink-600 text-xl">
                      ${(sweet.price * quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={isOutOfStock || isPurchasing}
                className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isPurchasing ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    {isOutOfStock ? 'Out of Stock' : `Purchase ${quantity > 1 ? `${quantity} items` : ''}`}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
