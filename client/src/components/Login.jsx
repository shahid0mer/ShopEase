import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  getUserProfile,
} from "../Features/User/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { shopEaseToast } from "../utils/shopEaseToast";

const Login = ({ onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    shopEaseToast.success(`Welcome, ${user.name}`);
  }

  const isSellerPage = location.pathname.startsWith("/seller");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (isSignIn) {
      // Handle Sign In
      console.log("Signing in:", email, password);
      await dispatch(loginUser({ email, password })).unwrap();
    } else {
      // Handle Registration
      if (!fullName || !confirmPassword) {
        alert("Please fill in all fields for registration");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      console.log("Creating account:", { email, password, name: fullName });

      await dispatch(
        registerUser({ email, password, name: fullName })
      ).unwrap();
      await dispatch(getUserProfile());
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      if (onClose) onClose();
    }
  }, [isAuthenticated, navigate, onClose]);

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
    setEmail("");
    setPassword("");
    setFullName("");
    setConfirmPassword("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, originX: 1, originY: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          duration: 0.4,
        }}
        className="flex justify-center items-center bg-gray-100 md:rounded-[var(--radius-lg)] max-w-[90vw] md:w-auto relative "
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-2  sm:top-4 sm:right-4 text-black text-3xl font-bold z-50"
        >
          &times;
        </button>

        {/* Responsive container */}
        <div className="p-4 md:p-0 flex flex-col md:flex-row shadow-[var(--shadow-2xl)] md:rounded-[var(--radius-lg)] w-full max-w-[90vw] md:max-w-none">
          {/* Left Panel with gradient + SVG pattern - hidden on small screens */}
          <motion.div className="hidden md:relative md:flex md:w-[300px] lg:w-[400px] xl:w-[600px] h-[600px] md:h-[700px] lg:h-[750px] items-center justify-center text-white overflow-hidden rounded-tl-lg rounded-bl-lg">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-dark)_100%)] opacity-90 z-10"></div>
            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignIn ? "signin" : "signup"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 },
                }}
                className="relative z-10 p-6 text-center text-lg font-semibold"
              >
                <p className="font-extrabold text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] mb-[var(--space-lg)] tracking-tight leading-1.5">
                  {isSellerPage
                    ? isSignIn
                      ? "Welcome Back, Seller!"
                      : "Join Our Seller Network"
                    : isSignIn
                    ? "Hello Friend!"
                    : "Welcome Back!"}
                </p>
                <p className="text-[0.875rem] sm:text-[1rem] lg:text-[1.125rem] text-[#ffffffe6] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)] font-normal">
                  {isSellerPage ? (
                    isSignIn ? (
                      "Don't have a seller account? Create one to start managing your business on our platform."
                    ) : (
                      <>
                        Already have a seller account? <br />
                        Sign in to access your dashboard and manage your store.
                      </>
                    )
                  ) : isSignIn ? (
                    "Don't have an account? Create one to start your shopping journey with us."
                  ) : (
                    <>
                      Already have an account? <br />
                      Sign in to access your account and discover amazing deals.
                    </>
                  )}
                </p>

                <div>
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="active:scale-95 hover:translate-y-[-2px] hover:bg-[rgba(225,225,225,0.3)] hover:border-[rgba(225,225,225,0.5)] transition-all duration-300 bg-[rgba(255,255,255,0.2)] border-2 border-[rgba(255,255,255,0.3)] py-[var(--space-sm)] sm:py-[var(--space-md)] px-[var(--space-xl)] sm:px-[var(--space-2xl)] rounded-[var(--radius-lg)] font-semibold text-[0.875rem] sm:text-[1rem] backdrop-blur-[10px]"
                  >
                    {isSignIn ? "Create Account" : "Sign In"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - full width on mobile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin" : "signup"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col w-full md:w-[300px] lg:w-[400px] xl:w-[600px] h-auto md:h-[700px] lg:h-[750px] items-center justify-center p-4 sm:p-6 md:p-8"
            >
              {/* Mobile-only toggle button */}
              <div className="md:hidden mb-6 w-full max-w-xs sm:max-w-sm">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="w-full py-2 px-4 rounded-lg bg-[var(--primary)] text-white font-medium text-sm sm:text-base hover:bg-[var(--primary-dark)] transition-colors"
                >
                  {isSignIn
                    ? "Need an account? Create one"
                    : "Already have an account? Sign In"}
                </button>
              </div>

              <div className="flex flex-col justify-center items-center w-full">
                <p className="font-extrabold text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] text-[var(--neutral-800)] text-center">
                  {isSignIn
                    ? isSellerPage
                      ? "Seller Sign In"
                      : "Sign In"
                    : isSellerPage
                    ? "Create Seller Account"
                    : "Create Account"}
                </p>
                <p className="text-[var(--neutral-500)] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-[var(--space-4xl)] text-center">
                  {isSignIn
                    ? isSellerPage
                      ? "Enter your seller credentials to access the dashboard"
                      : "Enter your credentials to access your account"
                    : isSellerPage
                    ? "Join us and start selling your products online"
                    : "Join ShopEase and start your shopping journey"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm"
              >
                {!isSignIn && (
                  <>
                    {/* Full Name - only show for registration */}
                    <label className="font-semibold text-[var(--neutral-700)] text-[0.75rem] sm:text-[0.875rem] leading-[0.025em] mb-1.5">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mb-4 sm:mb-6 bg-[var(--neutral-50)] placeholder-[--neutral-700] w-full pl-4 pr-4 py-2 sm:py-[var(--space-md)] rounded-[var(--space-lg)] border-2 border-[var(--neutral-200)] text-[0.875rem] sm:text-[1rem] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                    />
                  </>
                )}

                {/* Email */}
                <label className="font-semibold text-[var(--neutral-700)] text-[0.75rem] sm:text-[0.875rem] leading-[0.025em] mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-4 sm:mb-6 bg-[var(--neutral-50)] placeholder-[--neutral-700] w-full pl-4 pr-4 py-2 sm:py-[var(--space-md)] rounded-[var(--space-lg)] border-2 border-[var(--neutral-200)] text-[0.875rem] sm:text-[1rem] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                />

                {/* Password */}
                <label className="font-semibold text-[var(--neutral-700)] text-[0.75rem] sm:text-[0.875rem] leading-[0.025em] mb-1.5">
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mb-4 sm:mb-6 bg-[var(--neutral-50)] placeholder-[--neutral-700] w-full pl-4 pr-4 py-2 sm:py-[var(--space-md)] rounded-[var(--space-lg)] border-2 border-[var(--neutral-200)] text-[0.875rem] sm:text-[1rem] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                />

                {!isSignIn && (
                  <>
                    {/* Confirm Password - only show for registration */}
                    <label className="font-semibold text-[var(--neutral-700)] text-[0.75rem] sm:text-[0.875rem] leading-[0.025em] mb-1.5">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm Your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mb-4 sm:mb-6 bg-[var(--neutral-50)] placeholder-[--neutral-700] w-full pl-4 pr-4 py-2 sm:py-[var(--space-md)] rounded-[var(--space-lg)] border-2 border-[var(--neutral-200)] text-[0.875rem] sm:text-[1rem] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all"
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="hover:translate-y-[-2px] mt-3 sm:mt-5 border-none rounded-[var(--radius-md)] bg-[var(--secondary)] text-white font-semibold py-2 sm:py-[var(--space-md)] px-4 sm:px-[var(--space-md)] hover:bg-[var(--secondary-dark)] hover:shadow-[var(--shadow-md)] duration-400 transition-all active:scale-95 w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading
                    ? "Loading..."
                    : isSignIn
                    ? "Sign In"
                    : "Create Account"}
                </button>

                {error && (
                  <p className="text-red-500 text-xs sm:text-sm text-center mt-2">
                    {error}
                  </p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
