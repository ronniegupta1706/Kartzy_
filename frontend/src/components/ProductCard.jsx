import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext'; // ✅ Add this
import { FaHeart } from 'react-icons/fa'; // ✅ Add icon

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist } = useWishlist(); // ✅ Access wishlist context
  const isWishlisted = wishlist.some(item => item._id === product._id); // ✅ Check status

  return (
    <div className="bg-gray-100 shadow-md rounded-lg hover:shadow-lg cursor-pointer transition duration-300 relative">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg w-full h-200px object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
          <p className="text-lg font-semibold text-red-500">Rs {product.price}</p>
        </div>
      </Link>

      {/* ❤️ Add to Wishlist Button */}
      <button
        onClick={() => addToWishlist(product)}
        className="absolute top-2 right-2 text-red-500 text-xl hover:scale-110 transition"
        title={isWishlisted ? "Already in wishlist" : "Add to wishlist"}
      >
        <FaHeart className={isWishlisted ? 'fill-current' : 'fill-transparent'} />
      </button>
    </div>
  );
};

export default ProductCard;
