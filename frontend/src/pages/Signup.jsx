import React, { useState } from 'react';
import loginImg from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, email, password, confirmPassword } = form;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return alert('All fields are required.');
    }

    if (!/^\d{10}$/.test(phone)) {
      return alert('Phone number must be exactly 10 digits.');
    }

    if (password.length < 6) {
      return alert('Password must be at least 6 characters long.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return alert('Password must include at least one special character.');
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match.');
    }

    try {
      await axios.post('http://localhost:5001/api/users/register', {
        name,
        phone,
        email,
        password,
      });

      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Error occurred during signup.');
      }
    }
  };

  return (
    <div className="bg-cover bg-center h-screen w-screen flex items-center justify-center">
      <div className="text-red-500 font-bold text-3xl absolute top-5 mb-10">
        <h2>Welcome to Kartzy!!!</h2>
      </div>
      <div className="absolute top-5 left-5 mx-10">
        <img src="/Kartzy.jpg" alt="Kartzy logo" className="w-32 h-32 p-2" />
      </div>
      <div className="bg-white shadow-lg rounded-2xl p-8 m-10 h-5/6 w-96">
        <h2 className="text-black opacity-100 font-bold text-2xl">SIGN UP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="phone number"
            className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirmed password"
            className="w-full p-2 mt-6 mb-6 bg-gray-100 opacity-200 rounded"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-red-500 rounded p-2 mx-20 my-5 hover:bg-red-700 display-center"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          .bg-cover {
            background-image: url(${loginImg});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
