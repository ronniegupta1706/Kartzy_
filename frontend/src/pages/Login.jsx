import React, { useState } from 'react';
import loginImg from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/api/users/login', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Login successful!');
      
      if (res.data.isAdmin) {
      navigate('/admin');
     } else {
      navigate('/home');
     }
    // Show toast after navigation if needed, or use a non-blocking notification library
    // Example: toast.success('Login successful!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('Server error during login');
      }
    }
  };

  return (
    <div className="bg-cover bg-center h-screen w-screen flex items-center justify-center">
      <div className="absolute top-5 left-5 mx-10">
        <img src="/Kartzy.jpg" alt="Kartzy Logo" className="w-32 h-32 p-2" />
      </div>
      <div className="bg-white shadow-lg rounded-2xl p-8 m-8 h-4/6 w-96">
        <h2 className="text-2xl font-bold text-black">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" onChange={handleChange} required type="email" placeholder="Email" className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded" />
          <input name="password" onChange={handleChange} required type="password" placeholder="Password" className="w-full p-2 mt-4 mb-6 bg-gray-100 opacity-200 rounded" />
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-red-500 rounded p-2 mx-20 my-5 hover:bg-red-700">Submit</button>
          </div>
          <a href="/forgot-password" className="p-2 mb-10 text-base hover:underline mt-10">Forgot Password?</a>
          <p className="text-base mb-10 mt-5 mx-2">
            New here? <a href="/signup" className="hover:underline">Sign up now.</a>
          </p>
        </form>
      </div>
      <style>{`
        .bg-cover {
            background-image: url(${loginImg});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
};

export default Login;
