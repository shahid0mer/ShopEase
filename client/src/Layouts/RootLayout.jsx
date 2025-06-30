import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../components/Login";

const RootLayout = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* The main content area. Its background will typically be set by child components or a global body/html dark mode class. */}
      {/* We add a dark mode background here to ensure a consistent base. */}
      <main className="min-h-screen bg-white dark:bg-neutral-950 ">
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
        <div className="fixed inset-0 z-50  bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center">
          <Login onClose={() => setShowLogin(false)} />
        </div>
      )}
    </>
  );
};

export default RootLayout;
