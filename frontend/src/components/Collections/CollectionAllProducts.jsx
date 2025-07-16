import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CollectionProductCard from '../../components/Collections/CollectionProductCard';

const CollectionAllProducts = () => {
  const { tag } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/tag/${tag}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching all products for collection:', err);
      }
    };

    fetchProducts();
  }, [tag]);

  const getMaxDiscount = () => {
    const discounts = products
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .map(p => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100));

    if (discounts.length === 0) return null;
    return Math.max(...discounts);
  };

  const discount = getMaxDiscount();

  const collectionHeadings = {
    fitness: {
      title: 'Gear Up for Your Fitness Goals',
      subtitle: 'Crush workouts with top-rated gym gear & essentials.',
    },
    kitchen: {
      title: 'Level Up Your Kitchen Game',
      subtitle: 'Smart tools & storage to simplify cooking.',
    },
    room: {
      title: 'Cozy Up Your Room in Style',
      subtitle: 'From lights to comfort – everything you need.',
    },
    travel: {
      title: 'Travel Smart, Travel Light',
      subtitle: 'Organize and move with must-have travel gear.',
    },
  };

  const currentHeading = collectionHeadings[tag] || {
    title: `Explore the Best of ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
    subtitle: 'Discover our top picks curated just for you.',
  };

  return (
    <div className="min-h-screen bg-yellow-50 pb-10 px-4">
      {/* 🌟 Enhanced Collection Banner */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-50 border border-pink-200 rounded-xl shadow p-6 my-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-2 tracking-tight">
          {currentHeading.title}
        </h1>
        <p className="text-gray-700 text-sm md:text-base">{currentHeading.subtitle}</p>
        {discount && (
          <div className="mt-3 text-sm text-gray-700 italic">
            🎉 Save up to <span className="font-bold text-black">{discount}%</span> on this collection!
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <CollectionProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No products found in this collection.
        </div>
      )}
    </div>
  );
};

export default CollectionAllProducts;
