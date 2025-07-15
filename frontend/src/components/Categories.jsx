// src/components/Categories.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Electronics', image: '/images/categories_headers/electronics.jpg', link: '/products/category/electronics' },
  { name: 'Clothing', image: '/images/categories_headers/clothing.jpg', link: '/products/category/clothing' },
  { name: 'Footwear', image: '/images/categories_headers/footwear.jpg', link: '/products/category/shoes' },
  { name: 'Furniture', image: '/images/categories_headers/furniture.jpg', link: '/products/category/furniture' },
  {name: 'Beauty&Personal Care', image:'/images/categories_headers/beauty.jpg', link:'/products/category/beauty'},
  {name: 'Sports',image:'/images/categories_headers/sports.jpg', link:'/products/category/sports'},
  {name: 'Books', image:'/images/categories_headers/books.jpg', link:'/products/category/books'},
  { name: 'Accessories & Bags', image: '/images/categories_headers/accessories.jpg', link: '/products/category/accessories' },

];

const Categories = () => {
  const navigate = useNavigate();

  return (
   <div className="bg-yellow-50 py-4">
    <div className="max-w-[1200px] mx-auto py-8 px-4 ">
      <h2 className=" text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> {/*using grid layout for storing cards as grid*/}
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(cat.link)}
            className="cursor-pointer rounded-lg overflow-hidden shadow hover:scale-105 transition-transform"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-[300px] object-cover" />
            <div className="bg-white py-2 text-center font-medium">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Categories;
