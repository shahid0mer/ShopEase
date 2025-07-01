import React, { useEffect } from "react";
import { Routes, Route, Router, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SellerHome from "./pages/SellerHome";
import AddProduct from "./components/AddProduct";
import SellerDashboardLayout from "./Layouts/SellerDashboardLayout";
import { checkAuthStatus, getUserProfile } from "./Features/User/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./Layouts/RootLayout";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AuthWrapper from "./components/AuthWrapper";
import { AnimatePresence, motion } from "motion/react";
import ProductListng from "./components/ProductListng";
import { Toaster, toast } from "sonner";
import Profile from "./pages/Profile";
import ProfileForm from "./components/ProfileForm";
import AddressForm from "./components/AddressForm";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import { selectDarkMode } from "./Features/DarkMode/darkModeSlice";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./Layouts/AdminLayout";
import AdminLogin from "./components/AdminLogin";
import Admin from "./pages/Admin";
import AdminCarouselManager from "./components/AdminCarouselManager";
import AdminUserManagement from "./components/AdminUserManagement";
import AdminAuthWrapper from "./components/AdminAuthWrapper";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminOrders from "./components/AdminOrders";
import SellerOrders from "./components/SellerOrders";

const App = () => {
  const darkMode = useSelector(selectDarkMode);

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
    duration: 0.45,
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
              path="results"
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
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["user", "seller"]}>
                  <Checkout />
                </ProtectedRoute>
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
              <Route
                path="orders"
                element={
                  <PageWrapper>
                    <SellerOrders />
                  </PageWrapper>
                }
              />
            </Route>
            <Route
              path="account"
              element={
                <ProtectedRoute allowedRoles={["user", "seller"]}>
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileForm />} />
              <Route path="editprofile" element={<ProfileForm />} />
              <Route path="editaddress" element={<AddressForm />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route
              path="/forgotpassword"
              element={
                <PageWrapper>
                  <ForgotPassword />
                </PageWrapper>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route
            path="/adminlogin"
            element={
              <PageWrapper>
                <AdminLogin />
              </PageWrapper>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminAuthWrapper>
                <AdminLayout />
              </AdminAuthWrapper>
            }
          >
            <Route
              path="dashboard"
              element={
                <PageWrapper>
                  <Admin />
                </PageWrapper>
              }
            />
            <Route
              path="carousal"
              element={
                <PageWrapper>
                  <AdminCarouselManager />
                </PageWrapper>
              }
            />
            <Route
              path="users"
              element={
                <PageWrapper>
                  <AdminUserManagement />
                </PageWrapper>
              }
            />
            <Route
              path="orders"
              element={
                <PageWrapper>
                  <AdminOrders />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AuthWrapper>
      <main>
        <AnimatedRoutes />
        <Toaster richColors position="top-center" expand={true} />
      </main>
    </AuthWrapper>
  );
};

export default App;
