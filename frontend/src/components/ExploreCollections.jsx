// src/components/ExploreCollections.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const curatedCollections = [
  {
    title: '🍳 Kitchen Must-Haves',
    subtitle: 'Cook smart with our top-rated tools & containers',
    image: '/images/Collections/kitchen.jpg',
    link: '/products/tag/kitchen',
    badge: 'Top Rated',
  },
  {
    title: '💪 Fitness Gear Zone',
    subtitle: 'Home workouts powered by mats, weights & more',
    image: '/images/Collections/gym.jpg',
    link: '/products/tag/fitness',
    badge: 'Editor’s Pick',
  },
  {
    title: '🛏️ Cozy Room Upgrades',
    subtitle: 'Posters, lights & comfort picks for every vibe',
    image: '/images/Collections/room.jpg',
    link: '/products/tag/room',
    badge: 'Best Seller',
  },
  {
    title: '✈️ Weekend Travel Picks',
    subtitle: 'Bags, bottles & travel-ready essentials',
    image: '/images/Collections/travel.jpg',
    link: '/products/tag/travel',
    badge: 'Limited Time',
  },
];

const ExploreCollections = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-12 bg-yellow-50">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          ✨ Curated Picks for Everyday Life
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {curatedCollections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="relative cursor-pointer group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[220px] w-full object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm mt-1">{item.subtitle}</p>
              </div>
              {item.badge && (
                <div className="absolute top-3 left-3 bg-white text-sm text-black px-3 py-1 rounded-full shadow-md font-medium">
                  {item.badge}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCollections;
