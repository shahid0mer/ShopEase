import React, { useEffect } from "react";
import { Routes, Route, Router, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SellerHome from "./pages/SellerHome";
import AddProduct from "./components/AddProduct";
import SellerDashboardLayout from "./Layouts/SellerDashboardLayout";
import { checkAuthStatus, getUserProfile } from "./Features/User/authSlice";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./Layouts/RootLayout";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AuthWrapper from "./components/AuthWrapper";
import { AnimatePresence, motion } from "motion/react";
import ProductListng from "./components/ProductListng";
import { Toaster, toast } from "sonner";
const App = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98, // Slightly scale down
      y: 20, // Move slightly down
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      scale: 1.02, // Slightly scale up on exit
      y: -20, // Move slightly up on exit
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.45, // Keep duration reasonable, perhaps 0.3-0.5s
  };

  const PageWrapper = ({ children }) => {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page-transition-container"
      >
        {children}
      </motion.div>
    );
  };

  // AnimatedRoutes is a component where AnimatePresence and Routes reside
  function AnimatedRoutes() {
    const location = useLocation(); // useLocation hook must be inside a Router

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/products"
              element={
                <PageWrapper>
                  <Products />
                </PageWrapper>
              }
            />
            <Route
              path="category/:categoryId"
              element={
                <PageWrapper>
                  <Products />
                </PageWrapper>
              }
            />
            <Route
              path="product/:productId"
              element={
                <PageWrapper>
                  <ProductDetails />
                </PageWrapper>
              }
            />
            <Route
              path="cart"
              element={
                <PageWrapper>
                  <CartPage />
                </PageWrapper>
              }
            />
            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <PageWrapper>
                    <SellerHome />
                  </PageWrapper>
                }
              />
              <Route
                path="add-product"
                element={
                  <PageWrapper>
                    <AddProduct />
                  </PageWrapper>
                }
              />
              <Route
                path="product-list"
                element={
                  <PageWrapper>
                    <ProductListng />
                  </PageWrapper>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AuthWrapper>
      <main>
        <AnimatedRoutes />
        <Toaster position="bottom-right" />
      </main>
    </AuthWrapper>
  );
};

export default App;
