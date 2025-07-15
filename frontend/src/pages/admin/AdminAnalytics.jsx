import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const COLORS = ['#4ade80', '#facc15', '#60a5fa', '#f87171', '#34d399', '#a78bfa', '#fca5a5', '#93c5fd', '#fcd34d', '#f472b6'];

const AdminAnalytics = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [topSellingCategories, setTopSellingCategories] = useState([]);

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token || !user.isAdmin) {
      toast.error('Unauthorized');
      return navigate('/admin-login');
    }

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/analytics-summary`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        // Pie - Order Status
        setOrderStatusData([
          { name: 'Delivered', value: data.orderStatus.delivered },
          { name: 'Pending', value: data.orderStatus.pending },
        ]);

        // Bar - Stock by Category
        const stockData = Object.entries(data.stockByCategory).map(([name, stock]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          stock,
        }));
        setProductCategoryData(stockData);

        // Bar - Top Selling Categories
        const soldData = Object.entries(data.soldByCategory)
          .map(([name, sold]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            sold,
          }))
          .sort((a, b) => b.sold - a.sold);
        setTopSellingCategories(soldData);
      } catch (err) {
        toast.error('Failed to load analytics');
        console.error(err);
      }
    };

    fetchAnalytics();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Sales & Inventory Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Order Status Pie */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Order Status (Delivered vs Pending)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%" cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stock by Product Category */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Current Stock by Product Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productCategoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} interval={0} height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" name="Stock">
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Categories */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Categories (Units Sold)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingCategories}>
              <XAxis dataKey="name" tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" name="Units Sold" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
