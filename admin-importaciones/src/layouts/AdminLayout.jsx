// src/layouts/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingCart, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth(); // Obtenemos el usuario y la función de salir

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                {/* Logo / Título */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-blue-400">IMPORTECH</h1>
                    <p className="text-xs text-slate-400 mt-1">Panel Administrativo</p>
                </div>
                
                {/* Menú de Navegación */}
                <nav className="flex-1 p-4 space-y-2">
                    {/* Usamos NavLink de react-router. 
                        Nos permite saber si la ruta está activa (isActive) para pintarla de azul.
                    */}
                    <NavLink 
                        to="/admin/inventario" 
                        className={({ isActive }) => 
                            `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`
                        }
                    >
                        <Package size={20} />
                        <span className="font-medium">Inventario</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/ventas" 
                        className={({ isActive }) => 
                            `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`
                        }
                    >
                        <ShoppingCart size={20} />
                        <span className="font-medium">Ventas e Historial</span>
                    </NavLink>

                    {/* Módulo opcional de usuarios (Solo visual por ahora) */}
                    <NavLink 
                        to="/admin/usuarios" 
                        className={({ isActive }) => 
                            `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`
                        }
                    >
                        <Users size={20} />
                        <span className="font-medium">Usuarios</span>
                    </NavLink>
                </nav>

                {/* Sección del Usuario (Abajo) */}
                <div className="p-4 border-t border-slate-800">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Área Principal de Contenido */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Aquí cargaremos las páginas (Inventario, Ventas) 
                    dependiendo de la URL en la que estemos.
                */}
                <div className="flex-1 overflow-auto bg-gray-50 p-8">
                    <Outlet /> 
                </div>
            </main>
            
        </div>
    );
}