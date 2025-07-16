import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist } = useWishlist();
  const isWishlisted = wishlist.some(item => item._id === product._id);

  const isCollection = product.type === 'collection';
  const hasDiscount =
    isCollection &&
    product.originalPrice &&
    product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-100 shadow-md rounded-lg hover:shadow-lg cursor-pointer transition relative">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-t-lg w-full h-[220px] object-contain bg-white p-2"
        />
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <h2 className="text-lg font-semibold mb-1">{product.name}</h2>

          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              ₹ {product.originalPrice}
            </p>
          )}
          <p className="text-lg font-semibold text-red-500">
            ₹ {product.price}
          </p>
        </div>
      </Link>

      {hasDiscount && discountPercent > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {discountPercent}% OFF
        </div>
      )}

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

export default ProductCard;
