import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard"; // Ensure this path is correct

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-neutral-900">
      <div className="flex w-full relative">
        <AdminDashboard
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 w-full lg:ml-64 bg-gray-50 dark:bg-neutral-900 min-h-screen overflow-x-auto">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 p-4 fixed top-0 w-full z-40">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <span className="text-gray-600 dark:text-neutral-300 text-lg">
                  ☰
                </span>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Admin Dashboard
              </h1>
              <div className="w-8"></div> {/* Placeholder for alignment */}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
