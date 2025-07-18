import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, Truck } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!user?.token || !user.isAdmin) {
      toast.error('Unauthorized');
      return navigate('/admin-login');
    }

    const load = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/orders/admin/all', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data);
      } catch (err) {
        toast.error(err.message || 'Error loading orders');
      }
    };
    load();
  }, [user, navigate]);

  const handleStatus = async (id, delivered) => {
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isDelivered: delivered }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Order status updated');
      setOrders(o => o.map(x => x._id === id ? data.order : x));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete order?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Order deleted');
      setOrders(o => o.filter(x => x._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const applyFilter = (type) => {
    setFilter(type);
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !o.isDelivered && !o.isCancelled;
    if (filter === 'delivered') return o.isDelivered;
    if (filter === 'cancelled') return o.isCancelled;
    return true;
  });

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-3">
          {['all', 'pending', 'delivered', 'cancelled'].map(type => (
            <button
              key={type}
              onClick={() => applyFilter(type)}
              className={`px-4 py-2 rounded transition-all duration-150 font-medium border ${
                filter === type
                  ? 'bg-black text-white border-black scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 italic">No orders to show.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(o => (
              <div key={o._id} className="p-6 bg-white rounded-xl shadow space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Order ID: <strong>{o._id}</strong></span>
                  <span>{new Date(o.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-sm text-gray-700">
                  👤 <strong>{o.user.name}</strong> — {o.user.email}
                </div>

                <div>
                  <strong>Items:</strong>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {o.orderItems.map(i => (
                      <div key={i.product} className="flex items-center gap-2 border px-2 py-1 rounded">
                        <img src={i.image} alt={i.name} className="w-10 h-10 rounded object-cover" />
                        <span className="text-sm">{i.name} × {i.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700">📍 Address: {o.shippingAddress.address}</p>
                <p className="text-sm text-gray-700">💳 Payment: {o.paymentMethod}</p>

                <div className="flex justify-between items-center mt-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full 
                    ${
                      o.isCancelled
                        ? 'bg-red-100 text-red-700'
                        : o.isDelivered
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {o.isCancelled
                      ? 'Cancelled ❌'
                      : o.isDelivered
                        ? 'Delivered ✅'
                        : 'Pending 🕒'}
                  </span>

                  <div className="flex gap-3">
                    {!o.isCancelled && (
                      <button
                        onClick={() => handleStatus(o._id, !o.isDelivered)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-white text-sm
                          ${o.isDelivered
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        <Truck size={16} />
                        {o.isDelivered ? 'Mark Pending' : 'Mark Delivered'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(o._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                {/* Show cancel reason if cancelled */}
                {o.isCancelled && o.cancelReason && (
                  <p className="text-sm text-gray-600 italic mt-2">
                    🚫 Cancel Reason: <span className="font-medium text-red-700">{o.cancelReason}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
