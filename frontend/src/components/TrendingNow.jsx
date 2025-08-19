// src/components/TrendingNow.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const Card = ({ p }) => (
  <Link
    to={`/products/${p._id}`}
    className="block bg-white p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-300 h-full"
  >
    <div className="w-full h-48 flex items-center justify-center mb-3 overflow-hidden rounded-lg bg-gray-100">
      <img src={p.image} alt={p.name} className="object-contain max-h-full max-w-full" />
    </div>

    <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-2">{p.name}</h3>
    <p className="text-xs md:text-sm text-gray-500 mb-1">by {p.brand}</p>

    <div className="mt-2">
      <span className="text-red-600 font-bold text-lg">₹{p.price}</span>
      {p.originalPrice && p.originalPrice > p.price && (
        <span className="ml-2 text-gray-400 line-through">₹{p.originalPrice}</span>
      )}
      {typeof p.discountPercent === 'number' && p.discountPercent > 0 && (
        <span className="ml-2 text-green-600 font-medium">-{p.discountPercent}%</span>
      )}
    </div>

    <div className="mt-2 text-sm text-yellow-500 font-medium">
      ⭐ {p.rating?.toFixed(1) ?? 0} ({p.numreviews ?? 0})
    </div>
  </Link>
);

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (!cancelled) setData(Array.isArray(json) ? json : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
};

const TrendingNow = () => {
  // fetch both lists
  const picks = useFetch('http://localhost:5001/api/products/trending-and-related?limit=8');
  const also  = useFetch('http://localhost:5001/api/products/also-like?limit=8');

  // avoid duplicates across the two lists
  const alsoFiltered = useMemo(() => {
    const ids = new Set((picks.data || []).map(p => String(p._id)));
    return (also.data || []).filter(p => !ids.has(String(p._id)));
  }, [picks.data, also.data]);

  const sliderSettings = {
    dots: true,
    infinite: false,          // no repeats
    speed: 550,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768,  settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="space-y-12">
      {/* Top Picks */}
      <section className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            🔥 Top Picks For You
          </h2>
          <span className="text-xs md:text-sm text-gray-600">Personalized & fresh</span>
        </div>

        {picks.loading ? (
          <div className="py-8 text-center">Loading your picks…</div>
        ) : picks.error ? (
          <div className="py-8 text-center text-red-600">{picks.error}</div>
        ) : picks.data.length === 0 ? (
          <div className="py-8 text-center">No products available.</div>
        ) : (
          <Slider {...sliderSettings}>
            {picks.data.map(p => (
              <div key={p._id} className="px-3"><Card p={p} /></div>
            ))}
          </Slider>
        )}
      </section>

      {/* You May Also Like */}
      <section className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            ✨ You May Also Like
          </h2>
          <span className="text-xs md:text-sm text-gray-600">Similar to what you browse & buy</span>
        </div>

        {also.loading ? (
          <div className="py-8 text-center">Loading suggestions…</div>
        ) : also.error ? (
          <div className="py-8 text-center text-red-600">{also.error}</div>
        ) : alsoFiltered.length === 0 ? (
          <div className="py-8 text-center">No suggestions right now.</div>
        ) : (
          <Slider {...sliderSettings}>
            {alsoFiltered.map(p => (
              <div key={p._id} className="px-3"><Card p={p} /></div>
            ))}
          </Slider>
        )}
      </section>
    </div>
  );
};

export default TrendingNow;
