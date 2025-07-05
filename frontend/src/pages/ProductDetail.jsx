import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { cartItems, dispatch } = useCart();

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

  return (
    <div className="flex flex-col md:flex-row p-6 gap-10 max-w-[1200px] mx-auto bg-white rounded shadow-sm">
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 rounded">
        <img
          src={product.image}
          alt={product.name}
          className="h-[300px] object-contain p-4"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-red-600 font-semibold mb-2">Rs {product.price}</p>
        <p className="text-sm text-gray-700 mb-2"><strong>Brand:</strong> {product.brand}</p>
        <p className="text-sm text-gray-700 mb-2"><strong>Rating:</strong> ⭐ {product.rating} / 5</p>
        <p className="text-sm text-gray-700 mb-2"><strong>Stock:</strong> {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <p className="text-gray-800 mb-4">{product.description}</p>

        <div className="mb-4 bg-yellow-100 p-3 rounded-md text-sm">
          <p className="font-semibold text-green-800">Available Offers:</p>
          <ul className="list-disc ml-5 mt-1 text-gray-700">
            <li>10% off on Axis Bank Cards</li>
            <li>Flat ₹50 off on first Kartzy order</li>
            <li>No Cost EMI available on orders above ₹999</li>
            <li>Additional 5% off on SBI Credit/Debit cards</li>
          </ul>
        </div>

        <div className="flex gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
