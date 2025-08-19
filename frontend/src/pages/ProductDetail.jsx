import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { cartItems, dispatch } = useCart();
  const { wishlist, addToWishlist } = useWishlist();
  const isWishlisted = wishlist.some(item => item._id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/reviews/product/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (!product) return <div className="p-8 text-lg">Loading...</div>;

  const handleAddToCart = () => {
    if (product.countInStock === 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem && existingItem.quantity >= product.countInStock) {
      alert('You have already added maximum stock available.');
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert('Product added to cart!');
  };

  const handleBuyNow = () => {
    if (product.countInStock === 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    // ✅ Send only this product to checkout, without adding to cart
    navigate('/checkout', { state: { mode: 'single', singleItem: { ...product, quantity: 1 } } });
  };

  // Discount logic
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-yellow-50 py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto bg-white rounded shadow-md p-6">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center bg-gray-100 rounded">
          <img
            src={product.image}
            alt={product.name}
            className="h-[300px] object-contain p-4"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          {hasDiscount ? (
            <div className="mb-2">
              <p className="text-sm text-gray-500 line-through">₹ {product.originalPrice}</p>
              <p className="text-xl text-red-600 font-bold">₹ {product.price}</p>
              <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mt-1">
                {discountPercent}% OFF
              </span>
            </div>
          ) : (
            <p className="text-xl text-red-600 font-semibold mb-2">₹ {product.price}</p>
          )}

          <p className="text-sm text-gray-700 mb-1"><strong>Brand:</strong> {product.brand}</p>
          <p className="text-sm text-gray-700 mb-1">
            <strong>Rating:</strong> {avgRating ? (
              <>⭐ {avgRating} / 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</>
            ) : (
              'No ratings yet'
            )}
          </p>
          <p className="text-sm text-gray-700 mb-2"><strong>Stock:</strong> {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          <p className="text-gray-800 mb-4">{product.description}</p>

          {/* Offers Section */}
          <div className="mb-4 bg-yellow-100 p-3 rounded-md text-sm">
            <p className="font-semibold text-green-800">Available Offers:</p>
            <ul className="list-disc ml-5 mt-1 text-gray-700">
              <li>10% off on Axis Bank Cards</li>
              <li>Flat ₹50 off on first Kartzy order</li>
              <li>No Cost EMI available on orders above ₹999</li>
              <li>Additional 5% off on SBI Credit/Debit cards</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              {isWishlisted ? 'Wishlisted ❤️' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Customer Reviews</h3>
            {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}

            {reviews.map((review) => (
              <div key={review._id} className="mb-4 border-b pb-3">
                <div className="flex items-center mb-1">
                  <strong>{review.userName || 'Anonymous'}</strong>
                  <span className="ml-3 text-yellow-400">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx} className={idx < review.rating ? '' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
