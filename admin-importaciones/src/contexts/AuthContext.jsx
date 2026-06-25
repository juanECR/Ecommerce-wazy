// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Creamos el proveedor (quien envuelve a la app)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Al cargar la app, revisamos si ya había un token guardado
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user_data');
            
            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                // Opcional: Aquí podrías hacer una petición a /api/user para validar que el token sigue vivo
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Función para hacer Login
    const login = async (email, password) => {
        try {
            // Llamamos a tu backend de Laravel
            const response = await api.post('/login', { email, password });
            
            if (response.data.success) {
                const { token, user: userData } = response.data.data;
                
                // Guardamos en el navegador (Local Storage)
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                // Guardamos en la memoria de React
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al conectar con el servidor' 
            };
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            await api.post('/logout'); // Le avisamos a Laravel que destruya el token
        } catch (e) {
            console.error("Error al cerrar sesión en el servidor" + e);
        } finally {
            // Siempre borramos los datos locales, aunque el servidor falle
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);