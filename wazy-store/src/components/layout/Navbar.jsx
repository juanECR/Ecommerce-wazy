import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export const Navbar = () => {
  // Consumimos el totalItems de nuestro contexto
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Wazy Corp */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              WAZY<span className="text-[#2563eb]">.</span>
            </span>
          </Link>

          {/* Botón del Carrito */}
          <div className="flex items-center">
            {/* Por ahora nos llevará a /checkout, ruta que crearemos pronto */}
            <Link 
              to="/checkout" 
              className="relative p-2 text-gray-600 hover:text-[#2563eb] transition-colors"
              aria-label="Ir al carrito"
            >
              <ShoppingCart size={24} />
              
              {/* Badge (burbuja) con el número de items, solo se muestra si hay > 0 */}
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#2563eb] rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};