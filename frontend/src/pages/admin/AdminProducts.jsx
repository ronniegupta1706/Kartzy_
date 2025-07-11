import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', description: '', image: '', category: '', brand: '', countInStock: ''
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!user?.token || !user.isAdmin) {
      toast.error('Unauthorized');
      return navigate('/admin-login');
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error('Error loading products');
      }
    };

    fetchProducts();
  }, [navigate, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      toast.success('Product deleted');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `${BASE_URL}/api/admin/products/${editingProduct._id}`
      : `${BASE_URL}/api/admin/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');

      toast.success(editingProduct ? 'Product updated' : 'Product created');

      if (editingProduct) {
        setProducts(prev => prev.map(prod => (prod._id === data._id ? data : prod)));
      } else {
        setProducts(prev => [data, ...prev]);
      }

      setForm({ name: '', price: '', description: '', image: '', category: '', brand: '', countInStock: '' });
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {['name', 'price', 'image', 'category', 'brand', 'countInStock'].map((field) => (
          <input
            key={field}
            type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 rounded"
            required
          />
        ))}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded col-span-1 md:col-span-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-1 md:col-span-2">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <div className="space-y-4">
        {products.map(p => (
          <div key={p._id} className="border p-4 rounded bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h4 className="font-bold text-lg">{p.name}</h4>
              <p>₹{p.price} | Stock: {p.countInStock}</p>
              <p className="text-sm text-gray-600">Category: {p.category} | Brand: {p.brand}</p>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button onClick={() => startEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
