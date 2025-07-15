import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Trash2, Truck } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
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
      toast.success('Order updated');
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
      toast.success('Deleted');
      setOrders(o => o.filter(x => x._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">All Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 italic">No orders available.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(o => (
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
                    ${o.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {o.isDelivered ? 'Delivered' : 'Pending'}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatus(o._id, !o.isDelivered)}
                      className={`flex items-center gap-1 px-3 py-1 rounded text-white text-sm
                        ${o.isDelivered ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      <Truck size={16} />
                      {o.isDelivered ? 'Mark Pending' : 'Mark Delivered'}
                    </button>

                    <button
                      onClick={() => handleDelete(o._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
