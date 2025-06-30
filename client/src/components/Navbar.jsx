import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  logoutUser,
  upgradeSeller,
} from "../Features/User/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { persistor } from "../app/store";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { fetchProductsWithFilters } from "../Features/Product/productSlice";
import DarkModeToggle from "./DarkModeToggle";
import { toast } from "sonner";

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileMenuRef = useRef(null);

  const isSellerPage = location.pathname.startsWith("/seller");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isSeller = user?.role?.trim() === "seller";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      await persistor.purge();
      navigate("/");
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      try {
        await persistor.purge();
      } catch (purgeError) {
        console.error(
          "Error purging persistor after logout error:",
          purgeError
        );
      }
      navigate("/");
      toast.error("Logout failed. Please try again.");
    }
  };

  const cartItemCount = isAuthenticated
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div className="flex px-4 md:px-7 h-16 items-center justify-between bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-dark)_100%)] tracking-tight font-[1.75rem] sticky top-0 z-50 w-full">
      <button
        className="md:hidden text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className="logo group flex items-center gap-2 transition-transform duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <svg
          width={28}
          height={28}
          viewBox="0 0 28 28"
          fill="none"
          className="shrink-0 transition-transform duration-300 ease-in-out group-hover:rotate-[-5deg] group-hover:scale-105 items-center"
        >
          <path
            d="M6 4L3 8V22C3 22.5304 3.21071 23.0391 3.58579 23.4142C3.96086 23.7893 4.46957 24 5 24H23C23.5304 24 24.0391 23.7893 24.4142 23.4142C24.7893 23.0391 25 22.5304 25 22V8L22 4H6Z"
            fill="#F8FAFC"
            stroke="#047857"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M3 8H25"
            stroke="#047857"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 12C10 14.2091 11.7909 16 14 16C16.2091 16 18 14.2091 18 12"
            stroke="url(#handleGradient)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="handleGradient"
              x1={10}
              y1={12}
              x2={18}
              y2={12}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>

        <span className="font-montserrat font-bold text-[1.8rem] tracking-tight">
          Shop<span className="text-[#d97706] tracking-tight">Ease</span>
        </span>
      </div>

      <div className="hidden md:flex mx-4 flex-1 min-w-[200px] max-w-2xl">
        <div className="flex items-center border pl-4 gap-2 bg-white dark:bg-[var(--neutral-700)] border-gray-500/30 dark:border-[var(--neutral-500)] h-[46px] rounded-full overflow-hidden w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={30}
            viewBox="0 0 30 30"
            fill="#6B7280"
            className="dark:fill-[var(--neutral-300)]"
          >
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>
          <input
            type="search"
            className="w-full h-full outline-none text-[1.15rem] text-[var(--neutral-800)] dark:text-[var(--neutral-50)] bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const trimmed = searchQuery.trim();
                if (trimmed) {
                  dispatch(
                    fetchProductsWithFilters({
                      keyword: trimmed,
                      page: 1,
                      limit: 20,
                      sort: "",
                    })
                  );
                  navigate(`/results?keyword=${encodeURIComponent(trimmed)}`);
                }
              }
            }}
          />
          <button
            type="submit"
            className="bg-[var(--secondary)] w-32 h-9 rounded-full text-sm text-white hover:bg-[var(--secondary-dark)] active:scale-90 transition-all mr-[5px]"
            onClick={() => {
              const trimmed = searchQuery.trim();
              if (trimmed) {
                dispatch(
                  fetchProductsWithFilters({
                    keyword: trimmed,
                    page: 1,
                    limit: 20,
                    sort: "",
                  })
                );
                navigate(`/results?keyword=${encodeURIComponent(trimmed)}`);
              }
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {isAuthenticated ? (
          <>
            {user?.role?.trim() === "user" && (
              <button
                className="font-medium text-[0.95rem] text-white/90 px-[var(--space-md)] py-[var(--space-sm)] rounded-md transition-all duration-200 hover:text-white hover:bg-white/10 backdrop-blur-sm active:scale-95"
                onClick={async () => {
                  try {
                    const upgradeResult = await dispatch(
                      upgradeSeller()
                    ).unwrap();
                    console.log("Upgrade result:", upgradeResult);

                    const updatedProfile = await dispatch(
                      getUserProfile()
                    ).unwrap();
                    console.log(
                      "Updated profile after upgrade:",
                      updatedProfile
                    );

                    if (updatedProfile?.role?.trim() === "seller") {
                      toast.success("You are now a seller!");
                      navigate("/seller");
                    }
                  } catch (error) {
                    console.error("Upgrade failed:", error);
                    toast.error(
                      "Failed to upgrade to seller. Please try again."
                    );
                  }
                }}
              >
                Sell On ShopEase
              </button>
            )}
            {isAuthenticated &&
              isSeller &&
              (isSellerPage ? (
                <Link to="/">
                  <button className="font-medium text-[0.95rem] text-white/90 px-[var(--space-md)] py-[var(--space-sm)] rounded-md transition-all duration-200 hover:text-white hover:bg-white/10 backdrop-blur-sm active:scale-95">
                    Shop on ShopEase
                  </button>
                </Link>
              ) : (
                <Link to="/seller">
                  <button className="font-medium text-[0.95rem] text-white/90 px-[var(--space-md)] py-[var(--space-sm)] rounded-md transition-all duration-200 hover:text-white hover:bg-white/10 backdrop-blur-sm active:scale-95">
                    Seller Dashboard
                  </button>
                </Link>
              ))}

            <div className="relative" ref={profileMenuRef}>
              <button
                className="bg-[#ffffffb3] dark:bg-[var(--neutral-700)] rounded-full w-[40px] h-[40px] flex justify-center items-center hover:bg-white/20 dark:hover:bg-[var(--neutral-600)] transition-colors duration-200"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {user?.email ? (
                  <p className="text-[var(--neutral-800)] dark:text-[var(--neutral-50)] text-[1.5rem] font-medium text-center font-montserrat">
                    {user.email.charAt(0).toUpperCase()}
                  </p>
                ) : (
                  <FiUser className="text-[var(--neutral-800)] dark:text-[var(--neutral-50)] text-[1.2rem]" />
                )}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-neutral-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiSettings className="mr-2 text-gray-600 dark:text-neutral-400" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <FiLogOut className="mr-2 text-gray-600 dark:text-neutral-400" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="font-medium text-[0.95rem] text-white/90 px-[var(--space-md)] py-[var(--space-sm)] rounded-md transition-all duration-200 hover:text-white hover:bg-white/10 backdrop-blur-sm active:scale-95"
          >
            Login
          </button>
        )}

        <DarkModeToggle />

        {isSellerPage ? (
          <div className="w-10 h-10 px-[var(--space-md)] py-[var(--space-sm)]"></div>
        ) : (
          <Link to="/cart">
            <button className="font-medium text-[0.95rem] text-white/90 px-[var(--space-md)] py-[var(--space-sm)] transition-all duration-200 backdrop-blur-sm active:scale-110">
              <div className="relative w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="-1 -1 32 32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#000000"
                  className="dark:stroke-white"
                  id="Cart--Streamline-Mynaui"
                  height="32"
                  width="32"
                >
                  <desc>Cart Streamline Icon: https://streamlinehq.com</desc>
                  <path
                    d="M20.625 26.25a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75m-10 0a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75M4.6375 6.75h19.017500000000002c1.7225 0 2.9662500000000005 1.5875 2.4937500000000004 3.185l-2.0675 7C23.762500000000003 18.009999999999998 22.745 18.75 21.5875 18.75H10.14c-1.15875 0 -2.1775 -0.74125 -2.495 -1.815zm0 0L3.75 3.75"
                    strokeWidth="2"
                  ></path>
                </svg>

                <AnimatePresence>
                  {/* Corrected conditional rendering syntax here */}
                  {cartItemCount > 0 && (
                    <motion.div
                      key={cartItemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md"
                    >
                      {cartItemCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </Link>
        )}
      </div>

      {isSellerPage ? (
        <div className="md:hidden w-10 h-10 ml-4 sm:ml-6"></div>
      ) : (
        <Link to="/cart" className="md:hidden ml-4 sm:ml-6">
          <div className="relative w-10 h-10 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-1 -1 32 32"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#ffffff"
              id="Cart--Streamline-Mynaui"
              height="32"
              width="32"
            >
              <desc>Cart Streamline Icon: https://streamlinehq.com</desc>
              <path
                d="M20.625 26.25a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75m-10 0a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75M4.6375 6.75h19.017500000000002c1.7225 0 2.9662500000000005 1.5875 2.4937500000000004 3.185l-2.0675 7C23.762500000000003 18.009999999999998 22.745 18.75 21.5875 18.75H10.14c-1.15875 0 -2.1775 -0.74125 -2.495 -1.815zm0 0L3.75 3.75"
                strokeWidth="2"
              ></path>
            </svg>
            <AnimatePresence>
              {/* Corrected conditional rendering syntax here */}
              {cartItemCount > 0 && (
                <motion.div
                  key={cartItemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md"
                >
                  {cartItemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-dark)_100%)] p-4 shadow-lg z-40">
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const trimmed = searchQuery.trim();
                  if (trimmed) {
                    dispatch(
                      fetchProductsWithFilters({
                        keyword: trimmed,
                        page: 1,
                        limit: 20,
                        sort: "",
                      })
                    );
                    navigate(`/results?keyword=${encodeURIComponent(trimmed)}`);
                    setMobileMenuOpen(false);
                  }
                }
              }}
            />
          </div>

          <div className="flex flex-col space-y-3">
            {isAuthenticated && (
              <div className="flex items-center space-x-3 text-white">
                <div className="bg-[#ffffffb3] dark:bg-[var(--neutral-700)] rounded-full w-8 h-8 flex justify-center items-center">
                  <p className="text-[var(--neutral-800)] dark:text-[var(--neutral-50)] text-sm font-medium">
                    {user?.email ? user.email.charAt(0).toUpperCase() : ""}
                  </p>
                </div>
                <span>{user?.email}</span>
              </div>
            )}

            {isAuthenticated ? (
              <>
                {user?.role?.trim() === "user" && (
                  <button
                    className="text-left text-white py-2 px-4 rounded hover:bg-white/10"
                    onClick={async () => {
                      try {
                        await dispatch(upgradeSeller()).unwrap();
                        const updatedProfile = await dispatch(
                          getUserProfile()
                        ).unwrap();
                        if (updatedProfile?.role?.trim() === "seller") {
                          toast.success("You are now a seller!");
                          navigate("/seller");
                          setMobileMenuOpen(false);
                        }
                      } catch (error) {
                        toast.error(
                          "Failed to upgrade to seller. Please try again."
                        );
                      }
                    }}
                  >
                    Sell On ShopEase
                  </button>
                )}
                {isSeller &&
                  (isSellerPage ? (
                    <Link
                      to="/"
                      className="text-white py-2 px-4 rounded hover:bg-white/10 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop on ShopEase
                    </Link>
                  ) : (
                    <Link
                      to="/seller"
                      className="text-white py-2 px-4 rounded hover:bg-white/10 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  ))}
                <Link
                  to="/account"
                  className="text-white py-2 px-4 rounded hover:bg-white/10 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-white py-2 px-4 rounded hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-white py-2 px-4 rounded hover:bg-white/10"
              >
                Login
              </button>
            )}
            <div className="flex justify-center mb-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
