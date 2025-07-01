import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const SellerSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { path: "/seller/add-product", icon: "➕", label: "Add Product" },
    { path: "/seller/product-list", icon: "📋", label: "Product List" },
    { path: "/seller/orders", icon: "📦", label: "Orders" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm  bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      <div
        className={`
        w-64 mt-14 bg-white dark:bg-neutral-900 h-screen fixed left-0 top-16 lg:top-0 shadow-md border-r border-gray-100 dark:border-neutral-800 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* ShopEase Logo/Header - Only show on desktop */}
        <div className="hidden lg:block p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-emerald-600 mr-2">🛍️</span>
              <span>ShopEase</span>
              <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full dark:bg-emerald-900 dark:text-emerald-300">
                Seller
              </span>
            </h2>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-emerald-600 mr-2">🛍️</span>
              <span>ShopEase</span>
              <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full dark:bg-emerald-900 dark:text-emerald-300">
                Seller
              </span>
            </h2>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span className="text-gray-600 dark:text-neutral-300">✕</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
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
                    activeItem === item.path
                      ? "bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-900 dark:text-emerald-300"
                      : "text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                  {activeItem === item.path && (
                    <span className="ml-auto w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile/Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
              👤
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                Seller Name
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                seller@shopease.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;
