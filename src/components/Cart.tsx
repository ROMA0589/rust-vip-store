import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { createPayPalOrder } from '../services/paymentService';

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, removeFromCart, total, clearCart } = useCart();

  const toggleCart = () => setIsOpen(!isOpen);

  const handleCheckout = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      const order = await createPayPalOrder(items);
      
      if (!order.links) {
        throw new Error('No se recibió una respuesta válida de PayPal');
      }

      const approveLink = order.links.find(
        (link: any) => link.rel === 'approve'
      );

      if (!approveLink) {
        throw new Error('No se encontró el link de pago');
      }

      window.location.href = approveLink.href;
    } catch (error: any) {
      setError(error.message || 'Error al procesar el pago');
      console.error('Error en checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Botón del carrito - Ajustado para móviles */}
      <button
        onClick={toggleCart}
        className="fixed top-2 right-2 z-50 bg-gray-800/40 backdrop-blur-sm p-2 sm:p-3 rounded-full 
          shadow-lg hover:bg-gray-700/50 transition-colors border border-white/10"
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
              animate={{ opacity: 0.3 }}
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
              className="fixed right-0 top-0 h-screen w-full sm:w-80 bg-gray-800/50 backdrop-blur-md 
                p-4 sm:p-6 shadow-xl z-50 border-l border-white/10"
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
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex justify-between text-white mb-4">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm mb-4">
                        {error}
                      </div>
                    )}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing || items.length === 0}
                      className={`w-full py-2 px-4 rounded transition-colors ${
                        isProcessing || items.length === 0
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white font-bold`}
                    >
                      {isProcessing ? 'Procesando...' : 'Pagar con PayPal'}
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
