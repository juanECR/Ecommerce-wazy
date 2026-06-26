// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); // Extraemos la función de login del contexto
    const navigate = useNavigate(); // Para redireccionar después de entrar

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/admin/inventario'); // Si es exitoso, vamos al panel
        } else {
            setError(result.message); // Si falla, mostramos el error de Laravel
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="bg-blue-600 p-3 rounded-full text-white mb-4 shadow-lg shadow-blue-500/30">
                        <Package size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">IMPORTECH</h1>
                    <p className="text-gray-500 mt-1">Panel Administrativo</p>
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full text-white font-semibold py-3 rounded-lg transition shadow-md flex justify-center items-center gap-2 ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
                    </button>
                </form>

            </div>
        </div>
    );
}