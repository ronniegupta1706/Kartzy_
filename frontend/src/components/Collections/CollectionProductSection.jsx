import React from 'react';
import CollectionProductCard from './CollectionProductCard';

const CollectionProductSection = ({ title, products }) => {
  if (!products.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <CollectionProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionProductSection;
