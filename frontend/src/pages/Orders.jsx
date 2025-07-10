import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      console.error("Error fetching orders:", err);
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!orders.length) return <div className="p-6">No orders found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
        >
          Refresh Orders
        </button>
      </div>

      {orders.map(order => (
        <div key={order._id} className="border p-4 mb-4 bg-white shadow">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Order ID: <strong>{order._id}</strong></span>
            <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <p><strong>Shipping:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> {order.isDelivered ? 'Delivered' : 'Pending'}</p>

          <div className="mt-3">
            <h4 className="font-semibold mb-2">Items:</h4>
            <ul className="space-y-2">
              {order.orderItems.map(item => (
                <li key={item.product} className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <span>{item.name} × {item.qty} = ₹{item.qty * item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 text-right font-bold text-green-700">
            Total: ₹{order.totalPrice}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
