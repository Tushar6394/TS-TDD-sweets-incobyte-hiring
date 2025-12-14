import { motion } from 'framer-motion';
import { ShoppingCart, Package, Edit, Trash2 } from 'lucide-react';
import { Sweet } from '../types';
import { Link } from 'react-router-dom';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (id: string, quantity: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

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
  return `https://via.placeholder.com/300x200/${color}/FFFFFF?text=${category}`;
};

export const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, isAdmin }: SweetCardProps) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-pink-300 transition-all"
    >
      <Link to={`/sweets/${sweet._id}`}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
          <img
            src={sweet.imageUrl || getPlaceholderImage(sweet.category)}
            alt={sweet.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                categoryColors[sweet.category]
              }`}
            >
              {sweet.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/sweets/${sweet._id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-pink-600 transition-colors">
            {sweet.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sweet.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-pink-600">${sweet.price.toFixed(2)}</span>
          <div className="flex items-center gap-1 text-sm">
            <Package className="w-4 h-4 text-gray-500" />
            <span className={isOutOfStock ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {sweet.quantity} left
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(sweet._id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(sweet._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onPurchase?.(sweet._id, 1)}
              disabled={isOutOfStock}
              className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
