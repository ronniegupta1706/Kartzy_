import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductList = ({ limit, category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = category
        ? `http://localhost:5001/api/products/category/${category}`
        : `http://localhost:5001/api/products`;
      const res = await axios.get(url);
      setProducts(limit ? res.data.slice(0, limit) : res.data);
    };
    fetchProducts();
  }, [limit, category]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
