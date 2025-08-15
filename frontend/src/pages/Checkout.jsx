import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaUniversity, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import { SiPhonepe, SiGooglepay, SiPaytm } from 'react-icons/si';

const Checkout = () => {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({ label: '', details: '' });
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Payment inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankUsername, setBankUsername] = useState('');
  const [bankPIN, setBankPIN] = useState('');

  const { mode, singleItem } = location.state || {};
  const itemsToOrder = mode === 'single' && singleItem ? [singleItem] : cartItems;

  const subtotal = itemsToOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal < 500 ? 70 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    setUser(userInfo);
    const addressKey = `addresses_${userInfo.email}`;
    const saved = JSON.parse(localStorage.getItem(addressKey)) || [];
    setAddresses(saved);
    if (saved.length) setSelectedAddress(saved[0].details);
  }, [navigate]);

  const handleAddNewAddress = () => {
    if (!newAddress.label || !newAddress.details) {
      toast.error('Please enter both label and address');
      return;
    }
    const addressKey = `addresses_${user.email}`;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem(addressKey, JSON.stringify(updated));
    setSelectedAddress(newAddress.details);
    setNewAddress({ label: '', details: '' });
    setShowNewAddress(false);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(value);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      toast.error("Please select address and payment method");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: itemsToOrder.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: {
            address: selectedAddress,
            city: "City",
            postalCode: "000000",
            country: "India",
          },
          paymentMethod,
          totalPrice: total,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message);
        } else {
          const text = await res.text();
          console.error("Non-JSON error:", text);
          throw new Error("Server error (non-JSON)");
        }
      }

      const orderData = await res.json();
      if (mode === 'single' && singleItem) {
        dispatch({ type: 'REMOVE_FROM_CART', payload: singleItem._id });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }

      toast.success(`Payment successful! Payment ID: ${orderData._id || 'N/A'}`);
      navigate("/orders");

    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6">

          {/* Address Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">📍 Choose Delivery Address</h2>
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
              {showNewAddress ? 'Cancel' : '➕ Add New Address'}
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

          {/* Payment Method Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">🏦 Select Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Cash on Delivery", icon: <FaMoneyBillWave className="text-green-600" /> },
                { label: "Credit/Debit Card", icon: <FaCreditCard className="text-blue-600" /> },
                { label: "UPI", icon: <FaMobileAlt className="text-purple-600" /> },
                { label: "Net Banking", icon: <FaUniversity className="text-orange-600" /> },
              ].map(method => (
                <div
                  key={method.label}
                  onClick={() => setPaymentMethod(method.label)}
                  className={`cursor-pointer border rounded p-3 flex items-center gap-2 hover:border-blue-500 ${
                    paymentMethod === method.label ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {method.icon}
                  <span>{method.label}</span>
                </div>
              ))}
            </div>

            {/* Card UI */}
            {paymentMethod === "Credit/Debit Card" && (
              <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded shadow-inner">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="border px-2 py-1 w-full rounded"
                />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="border px-2 py-1 w-1/2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCVV}
                    onChange={e => setCardCVV(e.target.value)}
                    className="border px-2 py-1 w-1/2 rounded"
                  />
                </div>
              </div>
            )}

            {/* UPI UI */}
            {paymentMethod === "UPI" && (
              <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded shadow-inner">
                <div className="flex gap-4 text-3xl">
                  <SiPhonepe className="text-purple-600" />
                  <SiGooglepay className="text-blue-600" />
                  <SiPaytm className="text-sky-500" />
                </div>
                <input
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
              </div>
            )}

            {/* Net Banking UI */}
            {paymentMethod === "Net Banking" && (
              <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded shadow-inner">
                <h3 className="text-sm font-semibold mb-2">Select Your Bank</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "SBI", icon: "🏦" },
                    { name: "HDFC Bank", icon: "💳" },
                    { name: "ICICI Bank", icon: "🏛️" },
                    { name: "Axis Bank", icon: "💰" },
                  ].map((bank) => (
                    <div
                      key={bank.name}
                      onClick={() => setBankName(bank.name)}
                      className={`cursor-pointer border rounded p-3 flex items-center gap-2 hover:border-blue-500 ${
                        bankName === bank.name ? "border-blue-500 bg-white" : "border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{bank.icon}</span>
                      <span className="text-sm font-medium">{bank.name}</span>
                    </div>
                  ))}
                </div>
                {bankName && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Username"
                      value={bankUsername}
                      onChange={e => setBankUsername(e.target.value)}
                      className="border px-2 py-1 w-full rounded"
                    />
                    <input
                      type="password"
                      placeholder="PIN"
                      value={bankPIN}
                      onChange={e => setBankPIN(e.target.value)}
                      className="border px-2 py-1 w-full rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Summary */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">🧾 Order Summary</h2>
          {itemsToOrder.map(item => (
            <div key={item._id} className="mb-2 flex justify-between">
              <span>{item.title} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span><span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span><span>₹{total}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
          >
            ✅ Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
