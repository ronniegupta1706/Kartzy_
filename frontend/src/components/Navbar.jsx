import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaSearch,FaHeart, FaBoxOpen} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // ✅ added
import { useWishlist } from '../context/WishlistContext'; // ✅ added

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useCart(); // ✅ added
  const { wishlist } = useWishlist(); // ✅ added
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0); // ✅ added

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className="bg-yellow-200 text-gray-800 w-full h-auto">
      <nav className="flex items-center justify-between opacity-70 px-2 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/home')}>
          <img src="/Kartzy.jpg" className="w-10 h-10" alt="logo" />
          <span className="font-bold text-xl">Kartzy</span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center border border-gray-500 w-3/6 px-4 py-2 rounded"
        >
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow outline-none bg-transparent"
          />
        </form>

        {/* Icons */}
        <div className="flex items-center space-x-10 relative" ref={dropdownRef}>
          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <FaShoppingCart className="text-3xl" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          {/*Wishlist icon*/}
          <div className="relative cursor-pointer" onClick={() => navigate('/wishlist')}>
            <FaHeart className="text-3xl text-red-500" />
            {wishlist.length > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
              {wishlist.length}
             </span>
         )}

          </div>
           {/* Orders Icon */}
          <div className="relative cursor-pointer" onClick={() => navigate('/orders')}>
             <FaBoxOpen className="fas fa-box text-3xl text-blue-500"/>
          </div>
           {/* Profile Icon with Dropdown */}
          <div
            className="cursor-pointer text-3xl relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUser />
            {showDropdown && user && (
              <div className="absolute right-0 mt-12 mb -4 bg-white rounded shadow-lg z-50 text-sm">
                <div className="px-4 py-2 border-b">{user.name}</div>
                <div
                  className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
