import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { shopEaseToast } from "../utils/shopEaseToast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    shopEaseToast.error("pls login");
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
