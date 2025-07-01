import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logout from "../assets/logout.svg";
import { logoutAdmin } from "../Features/Admin/adminSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner"; // Assuming you have react-toastify for notifications

const AdminDashboard = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      navigate("/", { replace: true });
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { path: "/admin/carousal", icon: "👤", label: "Manage Promo Banners" },
    { path: "/admin/users", icon: "📋", label: "Manage Users/Sellers" },
    { path: "/admin/orders", icon: "📦", label: "Orders" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Admin Sidebar */}
      <div
        className={`
          w-64  bg-white dark:bg-neutral-900 h-screen fixed left-0 top-16 lg:top-0 shadow-md border-r border-gray-100 dark:border-neutral-800 z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="hidden lg:block p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-blue-600 mr-2">📊</span>{" "}
              <span>Admin Panel</span>
              <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Admin
              </span>
            </h2>
          </div>
        </div>

        <div className="lg:hidden p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-blue-600 mr-2">📊</span>{" "}
              <span>Admin Panel</span>
              <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Admin
              </span>
            </h2>

            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span className="text-gray-600 dark:text-neutral-300">✕</span>
            </button>
          </div>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.path);
                    onClose();
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.path ||
                    (item.path === "/admin/dashboard" &&
                      location.pathname === "/admin")
                      ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {(activeItem === item.path ||
                    (item.path === "/admin/dashboard" &&
                      location.pathname === "/admin")) && (
                    <span className="ml-auto w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-neutral-800">
          <button
            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
            onClick={handleLogout}
          >
            <img className="w-6 h-6 mr-3" src={logout} alt="Logout" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
