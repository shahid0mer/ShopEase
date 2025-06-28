import React, { useState } from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileForm from "../components/ProfileForm";
import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="flex">
      <ProfileSidebar />
      <div className=" p-8 w-[50%] h-auto mx-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
