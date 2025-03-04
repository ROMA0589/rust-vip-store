import { createContext, useContext, useState, ReactNode } from 'react';
import { VipPackage } from '../types';

interface CartItem extends VipPackage {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (pack: VipPackage) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (pack: VipPackage) => {
    setItems([...items, { ...pack, quantity: 1 }]);
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter((item: CartItem) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};
