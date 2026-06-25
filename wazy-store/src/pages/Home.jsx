import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        
        // Verificamos la estructura de la respuesta de Laravel
        // Si viene envuelta en 'data', extraemos esa propiedad. 
        // Si ya es un arreglo, lo pasamos directo. 
        // Si no es ninguno, pasamos un arreglo vacío como seguridad [].
        const productsArray = Array.isArray(response) 
          ? response 
          : (response?.data && Array.isArray(response.data) ? response.data : []);
          
        setProducts(productsArray);
        
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
        setProducts([]); // En caso de error, aseguramos que sea un arreglo vacío
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Catálogo Wazy <p className='font-extralight'>CORP</p>
        </h1>
        <p className="text-gray-500">Innovando el futuro</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {products.map((product) => (
          <article 
            key={product.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              {/* Laravel expone las imágenes en /storage/ */}
              <img 
                src={`http://127.0.0.1:8000/storage/${product.cover_image}`} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            
            <div className="p-6">
              <h2 className=" font-semibold text-black truncate">
                {product.name}
              </h2>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  S/{product.sale_price}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors active:scale-95"
                  aria-label="Agregar al carrito"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};