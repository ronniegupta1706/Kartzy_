import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const collectionData = {
  kitchen: {
    image: '/images/Collections/kitchen.jpg',
    title: 'Kitchen Must-Haves',
    tagline: 'Cook smart with our top-rated tools & containers',
    quote: '“The kitchen is the heart of the home.”',
    description: 'Discover must-have tools and smart storage to elevate your everyday cooking.',
  },
  fitness: {
    image: '/images/Collections/gym.jpg',
    title: 'Fitness Gear Zone',
    tagline: 'Home workouts powered by mats, weights & more',
    quote: '“Push yourself, because no one else is going to do it for you.”',
    description: 'Your fitness journey starts here. Explore powerful tools to train at home or on the go.',
  },
  room: {
    image: '/images/Collections/room.jpg',
    title: 'Cozy Room Upgrades',
    tagline: 'Posters, lights & comfort picks for every vibe',
    quote: '“Your space reflects your soul.”',
    description: 'Transform your room into a cozy, aesthetic space with our curated comfort picks.',
  },
  travel: {
    image: '/images/Collections/travel.jpg',
    title: 'Weekend Travel Picks',
    tagline: 'Bags, bottles & travel-ready essentials',
    quote: '“Life is short. The world is wide.”',
    description: 'Get set to travel smart with these must-have travel essentials at amazing prices.',
  },
};

const CollectionPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const data = collectionData[tag];

  if (!data) {
    return <div className="text-center py-20 text-gray-600">Invalid collection tag.</div>;
  }

  return (
    <div className="bg-yellow-50 min-h-screen">
      {/* 🖼️ Hero Banner */}
      <div className="relative w-full h-[65vh]">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow mb-2">{data.title}</h1>
          <p className="text-lg md:text-xl mb-4 font-light tracking-wide">{data.tagline}</p>
          <button
            onClick={() => navigate(`/products/tag/${tag}/all`)}
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition"
          >
            🛍️ Explore Collection
          </button>
        </div>
      </div>

      {/* Quote & Description */}
      <div className="max-w-4xl mx-auto py-10 px-6 text-center">
        <blockquote className="text-xl italic text-gray-800 mb-6">{data.quote}</blockquote>
        <p className="text-base text-gray-600 mb-4">{data.description}</p>
      </div>
    </div>
  );
};

export default CollectionPage;
