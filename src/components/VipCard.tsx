import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { VipPackage } from '../types';

interface VipCardProps {
  pack: VipPackage;
  key?: string;
}

export const VipCard: React.FC<VipCardProps> = ({ pack }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const getDefaultImage = (id: string) => {
    switch(id) {
      case 'pve':
        return 'https://cdn2.unrealengine.com/egs-rust-facepunch-studios-ltd-carousel-desktop-1920x1080-1920x1080-459402568.jpg';
      case 'pvp':
        return 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_3d27b3b616066c56ccd2db3bff42fb4c2482f484.jpg';
      case 'warlord':
        return 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_0c41f20c85fbb18f0ededd84ce87306147082d2c.1920x1080.jpg';
      default:
        return '';
    }
  };

  const handleBuy = () => {
    addToCart(pack);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-md bg-gray-800/30 rounded-xl overflow-hidden shadow-lg border border-white/10 min-h-[450px] max-w-sm mx-auto" // Reducido altura y añadido max-width
    >
      <div className="relative">
        <img 
          src={imageError ? getDefaultImage(pack.id) : pack.image}
          alt={pack.name}
          className="w-full h-40 object-cover transition-opacity duration-300" // Reducido a h-40
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 p-2"> {/* Reducido padding */}
          <h3 className="text-lg font-bold text-white mb-1 text-shadow">{pack.name}</h3> {/* Reducido a text-lg */}
        </div>
      </div>
      <div className="p-3"> {/* Reducido padding */}
        <div className="text-green-400 text-lg mb-2 font-bold">${pack.price}</div> {/* Ajustado tamaños */}
        <div className="text-gray-300 mb-2 text-sm">{pack.duration}</div>
        <ul className="space-y-1 mb-4"> {/* Reducido espaciado */}
          {pack.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-200 text-sm">✔️ {benefit}</li>
          ))}
        </ul>
        <button 
          onClick={handleBuy}
          className="w-full bg-green-500/80 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
        >
          Agregar al Carrito
        </button>
      </div>
    </motion.div>
  );
};

// Agregar estilo para sombra de texto
const style = document.createElement('style');
style.textContent = `
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;
document.head.appendChild(style);
