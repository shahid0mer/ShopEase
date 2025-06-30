// src/components/AdminAuthWrapper.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAdminAuth } from "../Features/Admin/adminSlice";
import { useNavigate, useLocation } from "react-router-dom";

const AdminAuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { initialized, isAuthenticated, user } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (!initialized) {
      dispatch(checkAdminAuth());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && (!isAuthenticated || !user)) {
      navigate("/", { replace: true, state: { from: location } });
    }
  }, [initialized, isAuthenticated, user, navigate, location]);

  if (!initialized) {
    return (
      <div className="p-6 text-center">Checking admin authentication...</div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
};

export default AdminAuthWrapper;
