import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { resetPasswordThunk } from "../Features/User/authSlice";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const message = await dispatch(
        resetPasswordThunk({ token, newPassword })
      ).unwrap();
      toast.success(message);
      navigate("/login");
    } catch (err) {
      toast.error(err || "Password reset failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--primary-dark)] active:scale-95 transition-all"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
