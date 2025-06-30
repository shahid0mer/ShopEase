import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePassword, updateProfile } from "../Features/User/authSlice.js";
import { toast } from "sonner"; // Ensure 'sonner' is installed and configured in your app's root.

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user: currentUser, loading } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Populate form fields when currentUser data changes
  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "Add Phone Number",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone === "Add Phone Number" ? "" : user.phone, // Send empty string if placeholder is still there
    };
    const resultAction = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } else {
      // Access error message from payload if available, otherwise generic
      toast.error(
        resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to update profile"
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const resultAction = await dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (changePassword.fulfilled.match(resultAction)) {
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } else {
      // Access error message from payload if available, otherwise generic
      toast.error(
        resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to change password"
      );
    }
  };

  return (
    <div
      className="w-full max-w-xl md:max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md
                 dark:bg-neutral-900 dark:shadow-lg rounded-lg my-8" // Added rounded-lg and vertical margin
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gray-800
                     dark:text-neutral-100" // Adjusted dark mode color for better contrast
        >
          My Profile
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[var(--secondary)] text-white rounded-md hover:bg-[var(--secondary-dark)] active:scale-95 transition
                       dark:bg-[var(--secondary-dark)] dark:hover:bg-[var(--secondary)]"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] active:scale-95 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }
            dark:bg-[var(--primary-dark)] dark:hover:bg-[var(--primary)] dark:disabled:bg-[var(--neutral-500)]`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700
                         dark:text-neutral-400" // Adjusted dark mode color
          >
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 focus:outline-none
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
              required
            />
          ) : (
            <p
              className="mt-1 px-3 py-2 bg-gray-100 rounded-md
                         dark:bg-neutral-800 dark:text-neutral-200" // Adjusted dark mode text styles
            >
              {user.name || "Not specified"}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700
                         dark:text-neutral-400" // Adjusted dark mode color
          >
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 focus:outline-none
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
              required
            />
          ) : (
            <p
              className="mt-1 px-3 py-2 bg-gray-100 rounded-md
                         dark:bg-neutral-800 dark:text-neutral-200" // Adjusted dark mode text styles
            >
              {user.email || "Not specified"}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700
                         dark:text-neutral-400" // Adjusted dark mode color
          >
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 focus:outline-none
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
            />
          ) : (
            <p
              className="mt-1 px-3 py-2 bg-gray-100 rounded-md
                         dark:bg-neutral-800 dark:text-neutral-200" // Adjusted dark mode text styles
            >
              {user.phone || "Not specified"}
            </p>
          )}
        </div>

        {/* Password Change Section */}
        {!showPasswordForm ? (
          <button
            type="button"
            onClick={() => setShowPasswordForm(true)}
            className="mt-6 text-sm text-blue-600 hover:text-blue-800 underline
                       dark:text-blue-400 dark:hover:text-blue-300"
          >
            Change Password
          </button>
        ) : (
          <div
            className="mt-6 p-4 border border-gray-200 rounded-md overflow-hidden
                       dark:border-neutral-700 dark:bg-neutral-800" // Adjusted dark mode background and border
          >
            <h3
              className="text-lg font-medium mb-4
                         dark:text-neutral-100" // Adjusted dark mode color
            >
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700
                             dark:text-neutral-400" // Adjusted dark mode color
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500
                             dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700
                             dark:text-neutral-400" // Adjusted dark mode color
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500
                             dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700
                             dark:text-neutral-400" // Adjusted dark mode color
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500
                             dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:focus:ring-[var(--primary-light)] dark:focus:border-[var(--primary-dark)]" // Adjusted dark mode input styles
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }
                  dark:bg-[var(--primary-dark)] dark:hover:bg-[var(--primary)] dark:disabled:bg-[var(--neutral-500)]`}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition
                             dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-600" // Adjusted dark mode button styles
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
