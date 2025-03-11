// frontend/src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;