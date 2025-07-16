// src/components/Collections/CollectionProductCard.jsx
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { FaHeart } from 'react-icons/fa';

const CollectionProductCard = ({ product }) => {
  const { wishlist, addToWishlist } = useWishlist();
  const isWishlisted = wishlist.some(item => item._id === product._id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white shadow-md rounded-lg hover:shadow-lg cursor-pointer transition relative overflow-hidden border border-gray-200">
      <Link to={`/products/${product._id}`}>
        {/* Product Image */}
        <div className="bg-gray-50 p-4 h-[220px] flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full object-contain"
          />

          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <h2 className="text-lg font-semibold mb-1 truncate">{product.name}</h2>

          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-lg text-red-600 font-bold">₹{product.price}</span>
            </div>
          ) : (
            <p className="text-lg font-semibold text-gray-800">₹{product.price}</p>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={() => addToWishlist(product)}
        className="absolute top-2 right-2 text-red-500 text-xl hover:scale-110 transition"
        title={isWishlisted ? 'Already in wishlist' : 'Add to wishlist'}
      >
        <FaHeart className={isWishlisted ? 'fill-current' : 'fill-transparent'} />
      </button>
    </div>
  );
};

export default CollectionProductCard;
