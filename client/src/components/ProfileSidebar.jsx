import React from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileSidebar = () => {
  const location = useLocation();

  // This function checks if the current path starts with the menu item's path
  const isActive = (path) =>
    location.pathname.startsWith(path) ||
    (path === "/account/editprofile" && location.pathname === "/account");

  const menuItems = [
    { path: "/account/editprofile", icon: "👤", label: "Profile" },
    { path: "/account/editaddress", icon: "📋", label: "View/Edit Address" },
    { path: "/account/orders", icon: "📦", label: "Orders" },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md border-r border-gray-100">
      <nav className="mt-6">
        <ul className="space-y-2 px-3 py-20">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
