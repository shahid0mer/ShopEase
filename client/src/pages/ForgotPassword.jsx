import React, { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordThunk } from "../Features/User/authSlice"; // adjust path if needed

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading } = useSelector((state) => state.auth);

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const message = await dispatch(forgotPasswordThunk(email)).unwrap();
      toast.success(message);
      setEmail("");
    } catch (err) {
      toast.error(err?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 ">
          <svg
            className="h-8 w-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
            ></path>
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-[var(--neutral-500)]">
          Forgot password?
        </h2>

        <p className="text-gray-600 mb-6 text-sm dark:text-[var(--neutral-500)]">
          No worries, we'll send you reset instructions.
        </p>

        {/* Email Input */}
        <div className="mb-4 text-left">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[var(--primary-light)] sm:text-sm"
          />
        </div>

        {/* Reset Password Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--primary-dark)] focus:outline-none text-base font-medium active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? "Sending..." : "Reset password"}
        </button>

        {/* Back to Login */}
        <div className="mt-6">
          <a
            href="/login"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
