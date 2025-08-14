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
import AdminAnalytics from './pages/admin/AdminAnalytics';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import CollectionPage from './pages/Collections/CollectionPage';
import CollectionAllProducts from './components/Collections/CollectionAllProducts';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';

import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingInfo from './pages/ShippingInfo';
import Terms from './pages/Terms';

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
            
           <Route path="/products/tag/:tag" element={<CollectionPage />} />
           <Route path="/products/tag/:tag/all" element={<CollectionAllProducts />} />

            

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/terms" element={<Terms />} />
          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
