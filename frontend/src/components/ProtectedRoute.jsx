import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated students straight to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
