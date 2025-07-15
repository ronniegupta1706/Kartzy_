import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart, PackageCheck, BarChart3, Boxes } from 'lucide-react';

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
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <ShoppingCart size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/products')}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Boxes size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Manage Products</p>
              <p className="text-lg font-semibold text-green-700">Go to Products</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/orders')}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
          >
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <PackageCheck size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Details</p>
              <p className="text-lg font-semibold text-yellow-700">View Orders</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/analytics')}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
          >
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <BarChart3 size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sales Analytics</p>
              <p className="text-lg font-semibold text-purple-700">View Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
