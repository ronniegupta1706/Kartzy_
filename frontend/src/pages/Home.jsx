// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import TrendingNow from '../components/TrendingNow';
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

      {/* Personalized carousels */}
      <section className="px-4 py-10">
        <TrendingNow />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
