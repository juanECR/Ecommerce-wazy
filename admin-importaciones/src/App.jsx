// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout'; // <-- Importamos el Layout
import Inventory from './pages/Inventory';       // <-- Importamos las páginas
import Sales from './pages/Sales';
import { useAuth } from './contexts/AuthContext';

// Componente protector
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="h-screen flex justify-center items-center">Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;
    
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* --- GRUPO DE RUTAS PROTEGIDAS --- */}
        <Route path="/admin" element={
            <ProtectedRoute>
                <AdminLayout /> {/* El Layout envuelve a las páginas hijas */}
            </ProtectedRoute>
        }>
            {/* Si entran a /admin directamente, los mandamos a inventario */}
            <Route index element={<Navigate to="inventario" replace />} />
            
            {/* Las páginas que se cargan dentro del <Outlet /> del Layout */}
            <Route path="inventario" element={<Inventory />} />
            <Route path="ventas" element={<Sales />} />
            <Route path="usuarios" element={<div className="p-8 text-gray-500">Módulo en construcción...</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


