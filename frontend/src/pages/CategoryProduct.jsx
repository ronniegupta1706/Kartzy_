// src/pages/CategoryProducts.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

const CategoryProducts = () => {
  const { categoryName } = useParams();

  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 capitalize">{categoryName} Products</h2>
      <ProductList category={categoryName} />
    </div>
  );
};

export default CategoryProducts;
