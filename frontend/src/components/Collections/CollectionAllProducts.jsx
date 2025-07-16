import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';

const CollectionAllProducts = () => {
  const { tag } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/tag/${tag}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching all products for collection:', err);
      }
    };

    fetchProducts();
  }, [tag]);

  return (
    <div className="min-h-screen bg-yellow-50 py-10 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          All Products for "{tag.charAt(0).toUpperCase() + tag.slice(1)}"
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          Everything you need for your {tag} lifestyle — handpicked and ready for you.
        </p>
        <div className="border-t border-gray-300 my-6 max-w-sm mx-auto" />
      </div>

      {products.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No products found in this collection.</div>
      )}
    </div>
  );
};

export default CollectionAllProducts;
