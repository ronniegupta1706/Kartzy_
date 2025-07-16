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
    originalPrice: '', // ✅ added
    description: '',
    image: '',
    brand: '',
    countInStock: '',
    type: 'category',
    category: '',
    tag: '',
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
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, // ✅ conditionally include
      countInStock: Number(form.countInStock),
      tag: form.type === 'collection' ? form.tag : '',
      category: form.type === 'category' ? form.category : '',
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
        originalPrice: '',
        description: '',
        image: '',
        brand: '',
        countInStock: '',
        type: 'category',
        category: '',
        tag: '',
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const categoryOptions = [
    'electronics', 'clothing', 'shoes', 'furniture',
    'beauty', 'sports', 'books', 'accessories',
  ];

  const tagOptions = ['kitchen', 'fitness', 'room', 'travel'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'price', 'originalPrice', 'image', 'brand', 'countInStock'].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 capitalize font-semibold">{field}</label>
            <input
              type={['price', 'countInStock', 'originalPrice'].includes(field) ? 'number' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border p-2 rounded"
              required={field !== 'originalPrice'} // ✅ optional field
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Product Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value, tag: '', category: '' })
            }
            className="border p-2 rounded bg-white text-gray-700"
            required
          >
            <option value="category">Category Product</option>
            <option value="collection">Collection Product</option>
          </select>
        </div>

        {form.type === 'category' && (
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded bg-white text-gray-700"
              required
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.type === 'collection' && (
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Collection Tag</label>
            <select
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="border p-2 rounded bg-white text-gray-700"
              required
            >
              <option value="">-- Select Tag --</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-semibold">Description</label>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

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
