import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    brand: '',
    countInStock: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo?.token || !userInfo.isAdmin) {
      toast.error('Unauthorized');
      return navigate('/admin-login');
    }

    const sanitizedForm = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(sanitizedForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      toast.success('Product added successfully!');
      setForm({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        brand: '',
        countInStock: '',
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'price', 'category', 'brand', 'countInStock', 'image'].map((field) => (
          <input
            key={field}
            type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 rounded"
            required
          />
        ))}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded col-span-1 md:col-span-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded col-span-1 md:col-span-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
