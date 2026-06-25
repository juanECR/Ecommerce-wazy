import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext.jsx'; // Importa el Provider
import App from './App.jsx';
import './index.css'; // Aquí vive el @import "tailwindcss"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* El Provider debe envolver a App para que el contexto exista globalmente */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
);