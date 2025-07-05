import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const addressKey = `addresses_${user?.email}`;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({ label: '', details: '' });
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal < 500 ? 70 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(addressKey)) || [];
    setAddresses(saved);
    if (saved.length) setSelectedAddress(saved[0].details);
  }, []);

  const handleAddNewAddress = () => {
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem(addressKey, JSON.stringify(updated));
    setSelectedAddress(newAddress.details);
    setNewAddress({ label: '', details: '' });
    setShowNewAddress(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress || !paymentMethod) {
      toast.error("Please select address and payment method");
      return;
    }

    const userOrdersKey = `orders_${user.email}`;
    const prevOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString(),
      items: cartItems,
      address: selectedAddress,
      payment: paymentMethod,
      total,
      status: 'Placed'
    };

    const updatedOrders = [...prevOrders, newOrder];
    localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
    dispatch({ type: 'CLEAR_CART' });
    toast.success("Order placed successfully!");
    navigate('/orders');
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
      {/* Left: Form */}
      <div className="flex-1 space-y-6">
        {/* Address Section */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Choose Delivery Address</h2>
          {addresses.map((addr, idx) => (
            <label key={idx} className="block mb-2">
              <input
                type="radio"
                name="address"
                checked={selectedAddress === addr.details}
                onChange={() => setSelectedAddress(addr.details)}
                className="mr-2"
              />
              <strong>{addr.label}:</strong> {addr.details}
            </label>
          ))}
          <button
            className="text-blue-600 mt-2"
            onClick={() => setShowNewAddress(!showNewAddress)}
          >
            {showNewAddress ? 'Cancel' : 'Add New Address'}
          </button>

          {showNewAddress && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Label (e.g. Home)"
                value={newAddress.label}
                onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                className="border px-2 py-1 w-full rounded"
              />
              <textarea
                placeholder="Address details"
                value={newAddress.details}
                onChange={e => setNewAddress({ ...newAddress, details: e.target.value })}
                className="border px-2 py-1 w-full rounded"
              />
              <button
                onClick={handleAddNewAddress}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Select Payment Method</h2>
          {["Cash on Delivery", "Credit/Debit Card", "UPI", "Net Banking"].map(method => (
            <label key={method} className="block mb-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="mr-2"
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {cartItems.map(item => (
          <div key={item._id} className="mb-2">
            <div className="flex justify-between">
              <span>{item.title} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
