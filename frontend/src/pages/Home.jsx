import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductList from './ProductList';

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <div className="px-4 py-8 bg-yellow-50">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Trending Products</h2>
        <ProductList limit={5} />
      </div>
    </div>
  );
};

export default Home;
