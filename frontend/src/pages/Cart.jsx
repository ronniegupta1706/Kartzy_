import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();

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
  const shipping = subtotal < 500 ? 70 : 0;
  const total = subtotal + shipping;

  const handleBuyNow = (item) => {
    navigate('/checkout', {
      state: {
        singleItem: item,
        mode: 'single',
      },
    });
  };

  const handlePlaceAllOrders = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout', {
      state: {
        fullCart: cartItems,
        mode: 'all',
      },
    });
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-lg">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map(item => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded mb-4 shadow"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded" />
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-red-600 font-semibold">₹{item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1, item.countInStock)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1, item.countInStock)}
                        className="px-3 py-1 bg-gray-200 rounded"
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
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                  >
                    🗑 Remove
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                  >
                    🛒 Buy Now
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 p-6 bg-white rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-4">💰 Price Summary</h3>
              <p className="text-gray-800">Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p className="text-gray-800">
                Shipping: ₹{shipping > 0 ? shipping.toFixed(2) : 'Free'}
              </p>
              <p className="font-bold text-green-700 text-xl mt-2">Total: ₹{total.toFixed(2)}</p>

              <button
                onClick={handlePlaceAllOrders}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              >
                ✅ Place All Orders
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
