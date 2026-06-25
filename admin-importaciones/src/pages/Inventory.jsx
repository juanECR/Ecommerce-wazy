// src/pages/Inventory.jsx
import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../services/api';
import ProductModal from '../components/ProductModal';

export default function Inventory() {
    // Estados para guardar los datos y controlar la interfaz
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // Función que llama a Laravel para pedir los productos
    const fetchProducts = useCallback(async () => {
        setIsLoading(true); // Opcional pero recomendado: mostrar loading al recargar
        try {
            const response = await api.get('/productos');
            
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar el inventario. Verifica la conexión con el servidor.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // useEffect hace que la función se ejecute automáticamente al abrir la página
    // 3. Agrega la función como dependencia del useEffect
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="space-y-6">
            
            {/* Cabecera y Barra de Búsqueda */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar SKU o nombre..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                    />
                </div>
                
                {/* Este botón abrirá el modal para crear productos en el próximo paso */}
                <button onClick={() => setIsModalOpen(true)} 
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm w-full sm:w-auto">
                    <Plus size={18} />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Manejo de Estados: Cargando o Error */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p className="text-gray-500 font-medium">Cargando inventario...</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-center">
                    {error}
                </div>
            )}

            {/* Tabla de Productos */}
            {!isLoading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                    <th className="p-4 font-semibold w-16">Img</th>
                                    <th className="p-4 font-semibold">Producto / SKU</th>
                                    <th className="p-4 font-semibold">Categoría</th>
                                    <th className="p-4 font-semibold text-right">Precio Venta</th>
                                    <th className="p-4 font-semibold text-center">Stock Físico</th>
                                    <th className="p-4 font-semibold text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            No hay productos registrados en el sistema.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4">
                                                {/* Mostrar imagen si existe, sino un ícono por defecto */}
                                                {prod.cover_image ? (
                                                    <img 
                                                        src={`http://127.0.0.1:8000/storage/${prod.cover_image}`} 
                                                        alt={prod.name} 
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-800">{prod.name}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{prod.sku}</p>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {/* Laravel nos envía la categoría anidada gracias al 'with' en el backend */}
                                                {prod.category ? prod.category.name : 'Sin categoría'}
                                            </td>
                                            <td className="p-4 text-right font-medium text-gray-800">
                                                S/ {Number(prod.sale_price).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    prod.stock <= prod.minimum_stock 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {prod.stock} un.
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                    prod.status 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${prod.status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {prod.status ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
             <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onProductAdded={fetchProducts} // Le pasamos la función para que recargue la tabla
            />
        </div>
    );
}