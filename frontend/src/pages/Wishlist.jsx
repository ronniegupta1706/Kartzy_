import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 shadow rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="h-20 w-20 object-contain" />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-red-500">Rs {product.price}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
