import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.length > 0 ? (
          results.map(product => <ProductCard key={product._id} product={product} />)
        ) : (
          <p className="col-span-full text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
