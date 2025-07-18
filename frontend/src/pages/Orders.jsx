// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cancelReason, setCancelReason] = useState({});
  const cancelOptions = [
    'Ordered by mistake',
    'Found a better price',
    'Product not needed anymore',
    'Delay in delivery',
    'Changed my mind'
  ];

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      toast.error("Please login to view orders");
      navigate('/login');
      return;
    }
    setUser(userInfo);
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchOrders();
  }, [user]);

  const cancelOrder = async (id) => {
    if (!cancelReason[id]) {
      toast.error('Please select a reason before cancelling.');
      return;
    }
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason: cancelReason[id] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div className="p-6 bg-yellow-50 min-h-screen">Loading...</div>;
  if (!orders.length) return <div className="p-6 bg-yellow-50 min-h-screen">No orders found.</div>;

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <button
            onClick={fetchOrders}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
          >
            🔁 Refresh Orders
          </button>
        </div>

        {orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 bg-white shadow rounded">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Order ID: <strong>{order._id}</strong></span>
              <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <p><strong>Shipping:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

            <p><strong>Status:</strong>{' '}
              <span className={`text-xs font-semibold px-2 py-1 rounded 
                ${order.isCancelled
                  ? 'bg-red-100 text-red-700'
                  : order.isDelivered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-800'}`}>
                {order.isCancelled
                  ? 'Cancelled ❌'
                  : order.isDelivered
                    ? 'Delivered ✅'
                    : 'Pending 🕒'}
              </span>
            </p>

            <div className="mt-3">
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="space-y-2">
                {order.orderItems.map(item => (
                  <li key={item.product} className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <span>{item.name} × {item.qty} = ₹{(item.qty * item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 text-right font-bold text-green-700">
              Total: ₹{order.totalPrice.toFixed(2)}
            </div>

            {!order.isDelivered && !order.isCancelled && (
              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <select
                  value={cancelReason[order._id] || ''}
                  onChange={e => setCancelReason({ ...cancelReason, [order._id]: e.target.value })}
                  className="border rounded px-3 py-1"
                >
                  <option value="">Select cancellation reason</option>
                  {cancelOptions.map((reason, i) => (
                    <option key={i} value={reason}>❗ {reason}</option>
                  ))}
                </select>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
