import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, total } = useCart();

  const toggleCart = () => setIsOpen(!isOpen);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      const data = await response.json();
      window.location.href = data.paypalUrl;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  return (
    <>
      {/* Botón del carrito - Ajustado para móviles */}
      <button
        onClick={toggleCart}
        className="fixed top-2 right-2 z-50 bg-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <div className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-white" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para cerrar el carrito */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black z-40"
            />
            
            {/* Panel del carrito - Ajustado para móviles */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 h-screen w-full sm:w-80 bg-gray-800 p-4 sm:p-6 shadow-xl z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Carrito</h2>
                <button 
                  onClick={toggleCart}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {items.length === 0 ? (
                <p className="text-gray-400">El carrito está vacío</p>
              ) : (
                <>
                  <ul className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-white">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-white mb-4">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                      Pagar con PayPal
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
