import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return user?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
