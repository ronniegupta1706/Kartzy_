import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return user?.token && user.isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminRoute;
