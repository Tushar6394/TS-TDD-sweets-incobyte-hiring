import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Sweet } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (sweet: Sweet, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.sweet._id === sweet._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.sweet._id === sweet._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { sweet, quantity }];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setItems(prevItems => prevItems.filter(item => item.sweet._id !== sweetId));
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.sweet._id === sweetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.sweet.price * item.quantity), 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};