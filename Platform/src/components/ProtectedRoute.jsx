import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const userLoggedIn = localStorage.getItem('userLoggedIn');

  if (!token || !userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}