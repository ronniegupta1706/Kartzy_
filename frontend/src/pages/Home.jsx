import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductList from './ProductList';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ExploreCollections = () => {
  const navigate = useNavigate();
  const collections = [
    { name: 'Mobiles', img: '/categories/mobiles.jpg', link: '/products/category/electronics' },
    { name: 'Fashion', img: '/categories/fashion.jpg', link: '/products/category/clothing' },
    { name: 'Laptops', img: '/categories/laptop.jpg', link: '/products/category/electronics' },
    { name: 'Shoes', img: '/categories/shoes.jpg', link: '/products/category/shoes' },
  ];

  return (
    <section className="px-4 py-10 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Explore Collections</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {collections.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.link)}
            className="cursor-pointer bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-[160px] object-cover rounded-t-lg"
            />
            <div className="text-center py-3 font-semibold text-gray-700">{item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PromoBanner = () => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-10 px-6 text-center">
    <h2 className="text-3xl font-bold mb-2">🚀 Fresh Finds Just Dropped</h2>
    <p className="text-lg">Handpicked for your next upgrade.</p>
  </div>
);

const Home = () => {
  return (
    <div className="bg-[#fffef5]">
      <Hero />
      <Categories />
      <PromoBanner />
      <ExploreCollections />
      <section className="px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🔥 Trending Now</h2>
        <ProductList limit={8} />
      </section>
      <Footer />
    </div>
  );
};

export default Home;
