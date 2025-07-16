import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import collectionMeta from '../../data/collectionMeta';
import ProductCard from '../../components/ProductCard';

const CollectionPage = () => {
  const { tag } = useParams();
  const [products, setProducts] = useState([]);
  const meta = collectionMeta[tag];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/tag/${tag}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };

    fetchProducts();
  }, [tag]);

  if (!meta) return <div className="p-6 text-xl">❌ Invalid Collection</div>;

  const trending = products.slice(0, 4);
  const under500 = products.filter(p => p.price <= 500);
  const discount = Math.floor(Math.random() * 20) + 10;

  return (
    <div className="min-h-screen bg-[#fffef9]">
      {/* Hero Banner */}
      <div
        className="h-[320px] w-full bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${meta.banner})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{meta.title}</h1>
          <p className="mt-3 text-lg italic">{meta.motto}</p>
          <div className="mt-3 inline-block bg-red-500 text-white text-sm px-4 py-1 rounded-full shadow">
            Flat {discount}% OFF on Select Picks!
          </div>
        </div>
      </div>

      {/* Description and Body */}
      <div className="bg-yellow-50 h-full">
        <div className="max-w-4xl mx-auto text-center px-4 py-10">
          <p className="text-gray-700 text-lg leading-relaxed">
            {meta.description ||
              'Browse through a hand-picked selection of items perfect for your lifestyle. Whether you’re upgrading your space, fitness gear, or prepping for your next trip — we’ve got something just right.'}
          </p>
        </div>

        {/* Motivational Quote */}
        {meta.quote && (
          <div className="max-w-4xl mx-auto mt-[-20px] mb-8 px-4">
            <div className="bg-rose-100 text-rose-800 text-center py-3 px-4 rounded-lg text-sm italic shadow">
              {meta.quote}
            </div>
          </div>
        )}

        {/* Tag Suggestions */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Popular tags</h3>
          <div className="flex overflow-x-auto gap-3 pb-2">
            {['Storage', 'Mugs', 'Lights', 'Rugs', 'Posters'].map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Trending Picks */}
        {trending.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🔥 Top Picks You’ll Love</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trending.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Under ₹500 */}
        {under500.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💸 Best Under ₹500</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {under500.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-12 max-w-6xl mx-auto" />

        {/* CTA Button */}
        <div className="text-center mb-12">
          <Link to={`/collections/${tag}/all`}>
            <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition font-medium shadow-md">
              View All Products →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
