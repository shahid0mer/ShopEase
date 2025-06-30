import React, { useState } from "react";
import ProfileSidebar from "../components/ProfileSidebar"; // Assuming this path is correct
import { Outlet } from "react-router-dom";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-neutral-900">
      <div className="flex w-full relative">
        {/* Profile Sidebar */}
        <ProfileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:ml-64 bg-gray-50 dark:bg-neutral-900 min-h-screen overflow-x-auto">
          {/* Mobile Header - Visible only on screens smaller than 'lg' */}
          <div className="lg:hidden bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 p-4 fixed top-15 w-full z-40">
            {" "}
            {/* Changed top-12 to top-0 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800"
                aria-label="Open profile sidebar"
              >
                <span className="text-gray-600 dark:text-neutral-300 text-lg">
                  ☰
                </span>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                My Profile
              </h1>{" "}
              {/* Changed title to "My Profile" */}
              <div className="w-8"></div> {/* Spacer to balance the layout */}
            </div>
          </div>

          {/* Page Content - Adjust padding-top for fixed mobile header */}
          {/* The mt-16 class creates space for the fixed mobile header. */}
          <div className="p-4 w-full mt-16 lg:mt-0">
            {" "}
            {/* Added mt-16 for mobile header offset */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
