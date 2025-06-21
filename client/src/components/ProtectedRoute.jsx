import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!isAuthenticated) return <Navigate to="/" />;

  // If roles are provided, check if the user has an allowed role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
