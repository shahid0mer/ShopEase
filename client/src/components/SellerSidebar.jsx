import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SellerSidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { path: "/seller/add-product", icon: "➕", label: "Add Product" },
    { path: "/seller/product-list", icon: "📋", label: "Product List" },
    { path: "/seller/orders", icon: "📦", label: "Orders" },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md border-r border-gray-100">
      {/* ShopEase Logo/Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-emerald-600 mr-2">🛍️</span>
          <span>ShopEase</span>
          <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            Seller
          </span>
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setActiveItem(item.path)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.path
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            👤
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Seller Name</p>
            <p className="text-xs text-gray-500">seller@shopease.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;
