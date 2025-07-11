import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
const ProductList = ({ limit, category, filterBySale = false }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = category
        ? `http://localhost:5001/api/products/category/${category}`
        : `http://localhost:5001/api/products`;
      const res = await axios.get(url);

      let data = res.data;

      if (filterBySale) {
        data = data.filter(p => p.originalPrice && p.originalPrice > p.price);
      }

      setProducts(limit ? data.slice(0, limit) : data);
    };

    fetchProducts();
  }, [limit, category, filterBySale]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
