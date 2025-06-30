// src/components/AuthWrapper.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus, getUserProfile } from "../Features/User/authSlice";
import { fetchCartAsync } from "../Features/Cart/cartSlice";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();

  const { initialized, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!initialized) {
      console.log("Dispatching checkAuthStatus and getUserProfile...");
      dispatch(checkAuthStatus());
      dispatch(getUserProfile());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && isAuthenticated && user?._id) {
      console.log(
        "AuthWrapper: User is authenticated, dispatching fetchCartAsync..."
      );
      dispatch(fetchCartAsync(user._id));
    }
  }, [dispatch, initialized, isAuthenticated, user?._id]);

  // Optionally, you can show a loading spinner or null while authentication is being checked
  // if (!initialized) {
  //   return <div>Loading authentication...</div>;
  // }

  return <>{children}</>;
};

export default AuthWrapper;
