import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import { Pencil, Trash2 } from 'lucide-react';

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
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-xl shadow">
          {['name', 'price', 'image', 'category', 'brand', 'countInStock'].map((field) => (
            <input
              key={field}
              type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 p-3 rounded-md col-span-1 md:col-span-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-1 md:col-span-2"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        {/* Product List */}
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(p => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-xl shadow flex items-start gap-4"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  ₹{p.price} • Stock: {p.countInStock}
                </p>
                <p className="text-xs text-gray-500">
                  Category: {p.category} | Brand: {p.brand}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => startEdit(p)}
                  className="text-yellow-600 hover:text-yellow-700"
                  title="Edit"
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
