import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import { Pencil, Trash2 } from 'lucide-react';

const categories = [
  'electronics',
  'clothing',
  'footwear',
  'furniture',
  'beauty',
  'sports',
  'books',
  'accessories',
];

const tags = ['kitchen', 'fitness', 'room', 'travel'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    countInStock: '',
    rating: '',
    type: 'category',
    tag: '',
    category: '',
    originalPrice: '',
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const topRef = useRef(null);

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
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      rating: Number(form.rating),
      tag: form.type === 'collection' ? form.tag : '',
      category: form.type === 'category' ? form.category : '',
      originalPrice:
        form.type === 'collection' && form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
    };

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
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');

      toast.success(editingProduct ? 'Product updated' : 'Product created');

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((prod) => (prod._id === data._id ? data : prod))
        );
        setTimeout(() => {
          document.getElementById(data._id)?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else {
        setProducts((prev) => [data, ...prev]);
      }

      setForm({
        name: '',
        price: '',
        description: '',
        image: '',
        brand: '',
        countInStock: '',
        rating: '',
        type: 'category',
        tag: '',
        category: '',
        originalPrice: '',
      });
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
      brand: product.brand,
      countInStock: product.countInStock,
      rating: product.rating || '',
      type: product.type || 'category',
      tag: product.tag || '',
      category: product.category || '',
      originalPrice: product.originalPrice || '',
    });

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div ref={topRef}></div>
        <h2 className="text-2xl font-bold mb-6">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-xl shadow"
        >
          {['name', 'price', 'image', 'brand', 'countInStock', 'rating'].map((field) => (
            <input
              key={field}
              type={['price', 'countInStock', 'rating'].includes(field) ? 'number' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border border-gray-300 p-3 rounded-md shadow-sm"
              required
            />
          ))}

          {/* Type dropdown */}
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
                tag: '',
                category: '',
                originalPrice: '',
              })
            }
            className="border border-gray-300 p-3 rounded-md shadow-sm"
            required
          >
            <option value="category">Category Product</option>
            <option value="collection">Collection Product</option>
          </select>

          {/* Tag or Category dropdown based on type */}
          {form.type === 'collection' ? (
            <select
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="border border-gray-300 p-3 rounded-md shadow-sm"
              required
            >
              <option value="">-- Select Tag --</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-300 p-3 rounded-md shadow-sm"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Original Price shown only if it's a collection */}
          {form.type === 'collection' && (
            <input
              type="number"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="border border-gray-300 p-3 rounded-md shadow-sm"
              required
            />
          )}

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 p-3 rounded-md col-span-1 md:col-span-2 shadow-sm"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-1 md:col-span-2"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        {/* Product list */}
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              id={p._id}
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
                  Category: {p.category || '—'} | Brand: {p.brand} | ⭐ {p.rating}/5
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
