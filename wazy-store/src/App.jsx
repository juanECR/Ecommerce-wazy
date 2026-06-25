import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-950">
      {/* El Navbar global expone el estado del carrito en el DOM */}
      <Navbar />
      
      {/* Contenedor dinámico principal */}
      <main className="flex-grow">
        <Routes>
          {/* Ruta base: Catálogo de productos */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta crítica: Formulario de un solo paso e instrucciones de pago */}
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Ruta de confirmación: Post-venta exitosa */}
          <Route path="/success" element={<Success />} />
          
          {/* Fallback de seguridad por si escriben una ruta rota */}
          <Route 
            path="*" 
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">Página no encontrada</h2>
                <a href="/" className="text-[#2563eb] hover:underline mt-2">Regresar al inicio</a>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
