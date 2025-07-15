import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">❤️ My Wishlist</h2>

        {wishlist.length === 0 ? (
          <p className="text-gray-700">Your wishlist is empty.</p>
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
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-red-600 font-semibold">₹{product.price}</p>
                    <p className="text-sm text-gray-500">
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
                    disabled={product.countInStock === 0}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeFromWishlist(product._id);
                      toast.info('Removed from wishlist');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
