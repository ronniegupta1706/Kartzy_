import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.token && userInfo?.isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      if (!data.isAdmin) {
        toast.error('Access denied: Not an admin');
        return;
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Admin login successful');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10 p-6 shadow bg-white rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full border p-2 mb-3 rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
