import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext'; // ✅ Import provider
import { WishlistProvider } from './context/WishlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <WishlistProvider>
    <CartProvider>
      <App />
    </CartProvider>
   </WishlistProvider>
  </React.StrictMode>
);
