import React from 'react';
import { Link } from 'react-router-dom';  // for clickable product cards

const trendingProducts = [
  {
    id: 1,
    name: "Epson Projector",
    brand: "Epson",
    price: 8999,
    originalPrice: 12999,
    image: "/images/trending/projector.png",
  },
  {
    id: 2,
    name: "MuscleBlaze Whey Protein Shake (1kg)",
    brand: "MuscleBlaze",
    price: 1499,
    originalPrice: 1899,
    image: "/images/trending/protein.png",
  },
  {
    id: 3,
    name: "Classmate Notebooks Set of 6",
    brand: "Classmate",
    price: 299,
    originalPrice: 399,
    image: "/images/trending/classmate.png",
  },
  {
    id: 4,
    name: "Sleepwell Mattress",
    brand: "Sleepwell",
    price: 7999,
    originalPrice: 9999,
    image: "/images/trending/mattress.png",
  },
  {
    id: 5,
    name: "Philips Trimmer",
    brand: "Philips",
    price: 1199,
    originalPrice: 1699,
    image: "/images/trending/trimmer.png",
  },
  {
    id: 6,
    name: "Titan Wall Clock",
    brand: "Titan",
    price: 499,
    originalPrice: 799,
    image: "/images/trending/clock.png",
  },
  {
    id: 7,
    name: "RainShield Umbrella",
    brand: "RainShield",
    price: 299,
    originalPrice: 499,
    image: "/images/trending/umbrella.png",
  },
  {
    id: 8,
    name: "Prestige Pressure Cooker",
    brand: "Prestige",
    price: 1499,
    originalPrice: 1999,
    image: "/images/trending/cooker.png",
  },
];

const TrendingNow = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
      {trendingProducts.map(product => (
        <Link
          to={`/products/${product.id}`}
          key={product.id}
          className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer block max-w-[220px] mx-auto relative"
          style={{ minHeight: '320px' }}
        >
          {/* Trending badge moved outside image container */}
          <div
            className="absolute -top-3 left-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md select-none whitespace-nowrap"
            style={{ transform: 'translateX(-50%)' }}
          >
            TRENDING
          </div>

          <div
            style={{
              height: '180px',
              width: '220px',
              margin: '0 auto 0.5rem auto',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              backgroundColor: '#fff',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-contain rounded"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
          <h3 className="text-lg font-extrabold tracking-wide text-gray-900 font-sans">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1 italic font-light tracking-wide">by {product.brand}</p>
          <div className="mt-1">
            <span className="text-red-600 font-bold text-lg">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-gray-500 line-through font-medium">₹{product.originalPrice}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TrendingNow;
