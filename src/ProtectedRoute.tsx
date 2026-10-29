import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token") || "";

  return !isAuthenticated ? <Navigate to="/" /> : (
    <Outlet />
  )
}
export default ProtectedRoute;
