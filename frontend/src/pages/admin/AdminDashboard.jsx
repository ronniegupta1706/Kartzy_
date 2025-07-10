import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
      <p>Total Orders: <strong>{orders.length}</strong></p>
      <p className="mt-2 text-blue-500 underline cursor-pointer" onClick={() => navigate('/admin/orders')}>View All Orders</p>
      <p className="mt-1 text-blue-500 underline cursor-pointer" onClick={() => navigate('/admin/products')}>Manage Products</p>
      <p className="mt-1 text-blue-500 underline cursor-pointer" onClick={() => navigate('/admin/analytics')}>View Analytics</p>
    </div>
  );
};

export default AdminDashboard;
