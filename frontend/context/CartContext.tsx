import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(user?.cart || []);
  const isFirstRender = useRef(true);

  // 1. Sync from User record on load
  useEffect(() => {
    if (user?.cart) {
      setCart(user.cart);
    }
  }, [user]);

  // 2. Debounced Sync to Backend
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!session?.access_token) return;

    const timer = setTimeout(async () => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        await axios.post(`${apiUrl}/cart/sync`, 
          { cart }, 
          { headers: { Authorization: `Bearer ${session.access_token}` }}
        );
        console.log('Cart synced to MongoDB');
      } catch (err) {
        console.error('Cart sync failed:', err);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [cart, session]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item._id);
      if (existing) {
        return prev.map(i => i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== itemId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
