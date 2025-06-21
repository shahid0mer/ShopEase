import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/SellerSidebar";
import Navbar from "../components/Navbar";

const SellerDashboardLayout = () => {
  return (
    <div>
      <div className="flex">
        <SellerSidebar />
        <div className="ml-[300px] flex-1 bg-gray-50 min-h-screen p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;
