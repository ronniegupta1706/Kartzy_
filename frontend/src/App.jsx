import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryProducts from './pages/CategoryProduct';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Pages with Navbar */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/category/:categoryName" element={<CategoryProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/search" element={<SearchResults />} />
            {/* Protected Route for Logged-in Users */}
            <Route element={<PrivateRoute />}>
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Route>

          {/* Pages without Navbar */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
