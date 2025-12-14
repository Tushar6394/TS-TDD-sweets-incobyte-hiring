import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Candy, ShoppingBag, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Candy className="w-24 h-24 text-pink-500 drop-shadow-lg" />
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Satisfy Your
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              {' '}
              Sweet Tooth
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover the most delightful collection of candies, chocolates, and treats. Your
            one-stop shop for all things sweet!
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all border-2 border-purple-300 text-lg"
                >
                  Sign Up Free
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: Star,
              title: 'Premium Quality',
              description: 'Hand-picked sweets from the finest confectioners',
              color: 'text-yellow-500',
              bg: 'bg-yellow-50',
            },
            {
              icon: Sparkles,
              title: 'Fresh Daily',
              description: 'New arrivals and restocked favorites every day',
              color: 'text-pink-500',
              bg: 'bg-pink-50',
            },
            {
              icon: ShoppingBag,
              title: 'Easy Shopping',
              description: 'Simple checkout with instant order confirmation',
              color: 'text-purple-500',
              bg: 'bg-purple-50',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100"
            >
              <div className={`${feature.bg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to indulge?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers enjoying our sweet selection
          </p>
          <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/shop') : '/register'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <div className="fixed top-20 left-10 opacity-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Candy className="w-32 h-32 text-pink-300" />
        </motion.div>
      </div>
      <div className="fixed bottom-20 right-10 opacity-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Candy className="w-40 h-40 text-purple-300" />
        </motion.div>
      </div>
    </div>
  );
};
