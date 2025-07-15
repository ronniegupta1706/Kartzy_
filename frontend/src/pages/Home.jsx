import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductList from './ProductList';
import ExploreCollections from '../components/ExploreCollections';
import Footer from '../components/Footer';

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
