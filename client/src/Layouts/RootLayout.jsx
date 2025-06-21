import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getUserProfile, logout } from "../Features/User/authSlice";
import Navbar from "../components/Navbar";
import Login from "../components/Login";

const RootLayout = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <main className="min-h-screen">
        <div
          className={
            showLogin ? "blur-sm brightness-75 transition-all duration-300" : ""
          }
        >
          <Navbar onLoginClick={() => setShowLogin(true)} />
          <Outlet />
        </div>
      </main>

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-opacity-60 flex items-center justify-center">
          <Login onClose={() => setShowLogin(false)} />
        </div>
      )}
    </>
  );
};

export default RootLayout;
