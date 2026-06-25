import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { submitOrder } from '../services/checkoutService';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const Checkout = () => {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado del formulario mapeado al payload del backend
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_document: '',
    buyer_phone: '',
    buyer_email: '',
    shipping_address: '',
    shipping_department: '',
    shipping_province: '',
    shipping_district: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Formateamos los productos como lo pide Laravel: [{ id: 1, quantity: 2 }]
    const formattedProducts = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const payload = {
      ...formData,
      products: formattedProducts,
    };

    try {
      await submitOrder(payload);
      clearCart(); // Vaciamos el DOM
      navigate('/success'); // Llevamos a la pantalla de éxito
    } catch (err) {
      console.error('Error al procesar la orden:', err);
      setError('Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Si el carrito está vacío, no deberíamos estar aquí
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className="text-[#2563eb] hover:underline">
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Datos Personales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required name="buyer_name" placeholder="Nombre Completo" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="buyer_document" placeholder="Documento de Identidad (DNI/CE)" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="buyer_phone" placeholder="Teléfono / Celular" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="buyer_email" type="email" placeholder="Correo Electrónico" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-8">Datos de Envío</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required name="shipping_department" placeholder="Departamento" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="shipping_province" placeholder="Provincia" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="shipping_district" placeholder="Distrito" onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
                <input required name="shipping_address" placeholder="Dirección exacta" onChange={handleInputChange} className="w-full sm:col-span-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] outline-none" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {loading ? 'Procesando orden...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Resumen e Instrucciones */}
        <div className="lg:col-span-5 space-y-6">
          
         {/* Resumen del Carrito con Controles */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-4">Resumen de Compra</h2>
            
            <div className="space-y-1 mb-6 max-h-72 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                  
                  {/* Info del Producto */}
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 block truncate max-w-[200px]">{item.name}</span>
                    <span className="text-gray-400 text-xs">S/{parseFloat(item.sale_price || 0).toFixed(2)} c/u</span>
                  </div>

                  {/* Controles y Total */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {/* Botones + / - */}
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-l-lg transition-colors active:scale-90"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-r-lg transition-colors active:scale-90"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Subtotal del Item */}
                    <span className="font-bold text-gray-900 w-16 text-right">
                      S/{(parseFloat(item.sale_price || 0) * item.quantity).toFixed(2)}
                    </span>

                    {/* Botón Eliminar */}
                    <button 
                      type="button" 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* Total General */}
            <div className="pt-2 flex justify-between items-center text-lg font-black text-gray-900">
              <span>Total a pagar:</span>
              <span className="text-[#2563eb]">S/{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Instrucciones de Pago Manual */}
          <div className="bg-[#eff6ff] p-6 rounded-2xl border border-[#bfdbfe]">
            <h3 className="text-[#1e3a8a] font-bold text-lg mb-2">Instrucciones de Pago</h3>
            <p className="text-[#1e40af] text-sm mb-4">
              Realiza el depósito o transferencia a nuestras cuentas oficiales. 
              Al finalizar, enviaremos un comprobante preliminar a tu correo.
            </p>
            <ul className="text-sm text-[#1e3a8a] space-y-2 font-medium">
              <li>• BCP: 191-0000000-0-00 (Wazy Corp)</li>
              <li>• BBVA: 0011-0000-0000000000</li>
              <li>• Yape / Plin: 999 999 999</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};