import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Si ya existe, incrementamos la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (productId, newQuantity) => {
    // Si la cantidad llega a 0 o menos, eliminamos el producto del carrito
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculamos el precio total (asumiendo que tu API devuelve un campo 'price')
  const cartTotal = cart.reduce((total, item) => total + (item.sale_price * item.quantity), 0);
  // Calculamos la cantidad total de items para el badge del Navbar
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, totalItems, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook para consumir el contexto fácilmente
// Custom hook con validación de seguridad
export const useCart = () => {
  const context = useContext(CartContext);
  
  // Si context es undefined, significa que intentaste usar useCart en un componente
  // que no está dentro de las etiquetas <CartProvider>
  if (context === undefined) {
    throw new Error('useCart debe ser usado estrictamente dentro de un CartProvider');
  }
  
  return context;
};