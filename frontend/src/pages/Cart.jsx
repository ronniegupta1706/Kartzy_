import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  // Save cart to localStorage for persistence
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQty = (id, qty, stock) => {
    if (qty > stock) {
      toast.error('Cannot add more than available stock');
      return;
    }
    if (qty > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } });
      toast.info('Quantity updated');
    }
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping= subtotal <500 ? 70:0; // Free shipping for orders above ₹500
  const total = subtotal + shipping;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded mb-4 shadow"
            >
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQty(item._id, item.quantity - 1, item.countInStock)}
                      className="px-2 bg-gray-200"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, item.quantity + 1, item.countInStock)}
                      className="px-2 bg-gray-200"
                      disabled={item.quantity >= item.countInStock}
                    >
                      +
                    </button>
                  </div>
                  {item.quantity >= item.countInStock && (
                    <p className="text-red-500 text-sm mt-1">Reached stock limit</p>
                  )}
                </div>
              </div>
              <div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="bg-red-700 text-white px-3 py-1 rounded block mt-2"
                >
                  Remove
                </button>
                <button className="bg-green-500 text-white px-3 py-1 rounded mt-2 block">
                  Buy Now
                </button>
              </div>
            </div>
          ))}

          {/* Total Summary */}
          <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Price Summary</h3>
            <p className="text-gray-700">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-gray-700">
              Shipping: ₹{shipping > 0 ? shipping.toFixed(2) : 'Free'}
            </p>
            <p className="font-bold text-lg mt-2">Total: ₹{total.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
