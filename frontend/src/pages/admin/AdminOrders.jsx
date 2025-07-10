import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      {orders.map(o => (
        <div key={o._id} className="mb-4 p-4 border bg-white rounded shadow">
          <div className="flex justify-between text-sm mb-2">
            <span>Order: {o._id}</span>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">
            User: {o.user.name} — {o.user.email}
          </div>
          <div className="mb-2">
            <strong>Items:</strong>
            {o.orderItems.map(i => (
              <div key={i.product} className="flex items-center gap-3 my-1">
                <img src={i.image} alt={i.name} className="w-10 h-10 object-cover rounded" />
                <span>{i.name} × {i.qty} = ₹{i.qty * i.price}</span>
              </div>
            ))}
          </div>
          <div className="mb-2">Address: {o.shippingAddress.address}</div>
          <div className="mb-2">Payment: {o.paymentMethod}</div>
          <div className="mb-4">Status: {o.isDelivered ? 'Delivered' : 'Pending'}</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatus(o._id, !o.isDelivered)}
              className="bg-green-600 py-1 px-3 text-white rounded"
            >
              Mark {o.isDelivered ? 'Pending' : 'Delivered'}
            </button>
            <button
              onClick={() => handleDelete(o._id)}
              className="bg-red-600 py-1 px-3 text-white rounded"
            >
              Delete Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
