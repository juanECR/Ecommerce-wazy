// src/pages/Sales.jsx
import { useState, useEffect } from 'react';
import { Search, Loader2, FileText, Eye } from 'lucide-react';
import api from '../services/api';

export default function Sales() {
    // Estados
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ejecutar al montar el componente (Formato optimizado sin useCallback)
    useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true);
            try {
                // Ahora esto funcionará porque ya agregamos el método index en Laravel
                const response = await api.get('/ventas');
                if (response.data.success) {
                    setSales(response.data.data);
                }
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el historial de ventas. Verifica la conexión con el servidor.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []); // Corchetes vacíos: solo se ejecuta una vez al cargar la página

    // Función auxiliar para formatear la fecha a un formato amigable en Perú
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-PE', options);
    };

    return (
        <div className="space-y-6">
            
            {/* Cabecera y Búsqueda */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por cliente o N° de orden..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                    />
                </div>
                
                <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition shadow-sm w-full sm:w-auto">
                    <FileText size={18} />
                    <span>Exportar Reporte</span>
                </button>
            </div>

            {/* Manejo de Estados: Cargando o Error */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p className="text-gray-500 font-medium">Cargando historial de ventas...</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-center">
                    {error}
                </div>
            )}

            {/* Tabla de Ventas */}
            {!isLoading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                    <th className="p-4 font-semibold">Orden</th>
                                    <th className="p-4 font-semibold">Cliente</th>
                                    <th className="p-4 font-semibold">Fecha y Hora</th>
                                    <th className="p-4 font-semibold text-right">Monto Total</th>
                                    <th className="p-4 font-semibold text-center">Pago</th>
                                    <th className="p-4 font-semibold text-center">Despacho</th>
                                    <th className="p-4 font-semibold text-center w-16">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sales.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            Aún no se han registrado ventas en el sistema.
                                        </td>
                                    </tr>
                                ) : (
                                    sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4">
                                                <span className="font-bold text-blue-600 font-mono text-sm">{sale.order_number}</span>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-800 text-sm">{sale.buyer_name}</p>
                                                <p className="text-xs text-gray-500">{sale.buyer_document}</p>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {formatDate(sale.created_at)}
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                S/ {Number(sale.total_amount).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-center">
                                                {/* Etiqueta de Estado de Pago */}
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                                    sale.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 
                                                    sale.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {sale.payment_status === 'paid' ? 'Pagado' : 
                                                     sale.payment_status === 'pending' ? 'Pendiente' : 'Fallido'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {/* Etiqueta de Estado de Envío */}
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                                    sale.shipping_status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                                    sale.shipping_status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                                                    sale.shipping_status === 'packed' ? 'bg-purple-100 text-purple-700' : 
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {sale.shipping_status === 'delivered' ? 'Entregado' : 
                                                     sale.shipping_status === 'shipped' ? 'Enviado' : 
                                                     sale.shipping_status === 'packed' ? 'Empaquetado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                                                    title="Ver Detalle"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}