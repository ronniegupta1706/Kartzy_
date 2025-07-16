import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
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
    fetchProduct();
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

    const existingItem = cartItems.find(item => item._id === product._id);
    if (!existingItem || existingItem.quantity < product.countInStock) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }

    navigate('/checkout');
  };

  // 💡 Discount logic: if originalPrice > price
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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

          {/* 💥 Show price + discount if available */}
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
          <p className="text-sm text-gray-700 mb-1"><strong>Rating:</strong> ⭐ {product.rating} / 5</p>
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
          <div className="flex flex-wrap gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
