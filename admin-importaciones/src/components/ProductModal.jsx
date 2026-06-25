// src/components/ProductModal.jsx
import { useState, useEffect} from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ProductModal({ isOpen, onClose, onProductAdded }) {
    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category_id: '', // Usamos ID 1 por defecto (Asegúrate de tener al menos una categoría en tu BD)
        purchase_price: '',
        sale_price: '',
        stock: '',
        minimum_stock: '5'
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                setIsLoadingCategories(true);
                try {
                    const response = await api.get('/categorias');
                    if (response.data.success) {
                        setCategories(response.data.data);
                        // Auto-seleccionar la primera categoría si hay disponibles
                        if (response.data.data.length > 0 && !formData.category_id) {
                            setFormData(prev => ({ ...prev, category_id: response.data.data[0].id }));
                        }
                    }
                } catch (err) {
                    console.error("Error al cargar categorías", err);
                } finally {
                    setIsLoadingCategories(false);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Manejar cambios en los inputs de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar la selección de la imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Crear una URL temporal para previsualizar la imagen en el formulario
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Enviar los datos a Laravel
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Para enviar archivos, obligatoriamente debemos usar FormData en lugar de un JSON normal
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('sku', formData.sku);
        payload.append('category_id', formData.category_id);
        payload.append('purchase_price', formData.purchase_price);
        payload.append('sale_price', formData.sale_price);
        payload.append('stock', formData.stock);
        payload.append('minimum_stock', formData.minimum_stock);
        
        if (image) {
            payload.append('cover_image', image);
        }

        try {
            // Hacemos el POST a nuestro endpoint protegido
            const response = await api.post('/productos', payload, {
                headers: {
                    // Axios suele detectar esto automáticamente, pero es buena práctica declararlo al enviar archivos
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // Limpiar formulario
                setFormData({ name: '', sku: '', category_id: '', purchase_price: '', sale_price: '', stock: '', minimum_stock: '5' });
                setImage(null);
                setImagePreview(null);
                
                // Avisar a la tabla que debe recargarse y cerrar el modal
                onProductAdded();
                onClose();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al guardar el producto. Verifica los datos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Cabecera del Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Registrar Nuevo Producto</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Cuerpo del Formulario (con scroll si es muy alto) */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Fila 1: Nombre y SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Producto</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Código SKU</label>
                                <input type="text" name="sku" required value={formData.sku} onChange={handleChange} placeholder="Ej. AUD-001" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                            <select 
                                name="category_id" 
                                required 
                                value={formData.category_id} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                disabled={isLoadingCategories}
                            >
                                <option value="" disabled>
                                    {isLoadingCategories ? 'Cargando categorías...' : 'Seleccione una categoría'}
                                </option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fila 2: Precios y Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Costo Compra (S/)</label>
                                <input type="number" step="0.01" name="purchase_price" required value={formData.purchase_price} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Venta (S/)</label>
                                <input type="number" step="0.01" name="sale_price" required value={formData.sale_price} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Inicial</label>
                                <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                        </div>

                        {/* Fila 3: Subida de Imagen */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen Principal</label>
                            <div className="flex items-center gap-4">
                                {/* Vista previa de la imagen */}
                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="text-gray-400" size={24} />
                                    )}
                                </div>
                                {/* Input tipo file oculto con un botón personalizado */}
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        id="cover_image" 
                                        accept="image/png, image/jpeg, image/webp" 
                                        onChange={handleImageChange} 
                                        className="hidden"
                                    />
                                    <label htmlFor="cover_image" className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition font-medium text-sm">
                                        Seleccionar Archivo...
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, WEBP. Máx: 2MB.</p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Botones de Acción (Pie del Modal) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition">
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="productForm" 
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:bg-blue-400"
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {isLoading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>

            </div>
        </div>
    );
}
