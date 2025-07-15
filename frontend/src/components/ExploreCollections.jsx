// src/components/ExploreCollections.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const curatedCollections = [
  {
    title: '🍳 Kitchen Must-Haves',
    subtitle: 'Cook smart with our top-rated tools & containers',
    image: '/images/Collections/kitchen.jpg',
    link: '/products/tag/kitchen',
  },
  {
    title: '💪 Fitness Gear Zone',
    subtitle: 'Home workouts powered by mats, weights & more',
    image: '/images/Collections/gym.jpg',
    link: '/products/tag/fitness',
  },
  {
    title: '🛏️ Cozy Room Upgrades',
    subtitle: 'Posters, lights & comfort picks for every vibe',
    image: '/images/Collections/room.jpg',
    link: '/products/tag/room',
  },
  {
    title: '✈️ Weekend Travel Picks',
    subtitle: 'Bags, bottles & travel-ready essentials',
    image: '/images/Collections/travel.jpg',
    link: '/products/tag/travel',
  },
];

const ExploreCollections = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-12 bg-yellow-50">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">✨ Curated Picks for Everyday Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {curatedCollections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="cursor-pointer bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img src={item.image} alt={item.title} className="h-[180px] w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCollections;
