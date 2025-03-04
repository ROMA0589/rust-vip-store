import { VipCard } from './components/VipCard';
import { CartProvider } from './context/CartContext';
import { Cart } from './components/Cart';
import { VipPackage } from './types';
import { DiscordButton } from './components/DiscordButton';

const vipPackages: VipPackage[] = [
  {
    id: 'pve',
    name: 'PVE VIP',
    price: 2.00,
    duration: '30 días',
    benefits: [
      'Kit de recursos diario',
      'Acceso a zonas exclusivas',
      '2 homes adicionales'
    ],
    image: '/images/pve.jpg'  // Asegurarse de que la ruta es correcta
  },
  {
    id: 'pvp',
    name: 'PVP VIP',
    price: 3.00,
    duration: '30 días',
    benefits: [
      'Kit PVP diario',
      'Acceso a zonas PVP',
      'Tag especial'
    ],
    image: '/images/pvp.jpg'
  },
  {
    id: 'warlord',
    name: 'WARLORD VIP',
    price: 4.50,
    duration: '30 días',
    benefits: [
      'Todos los beneficios anteriores',
      'Kit Warlord exclusivo',
      'Prioridad máxima'
    ],
    image: '/images/warlord.jpg'
  }
];

function App() {
  return (
    <CartProvider>
      <>
        <div className="bg-game" />
        <div className="relative min-h-screen py-4 sm:py-8 px-2 sm:px-4 lg:px-8 flex flex-col">
          <Cart />
          <div className="max-w-7xl mx-auto flex-grow">
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-8">
              RUST VIP CUBA_GAMER
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {vipPackages.map((pack) => (
                <VipCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>
          <DiscordButton />
          {/* Footer */}
          <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-800 backdrop-blur-sm bg-black/20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm font-semibold">
                CUBA_GAMER © 2023 - {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </>
    </CartProvider>
  );
}

export default App;
