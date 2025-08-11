import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUserById,
  toggleUserRole,
} from "../Features/Admin/adminSlice";
import { toast } from "sonner";

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserById(id))
        .unwrap()
        .then(() => toast.success("User deleted successfully!"))
        .catch((err) =>
          toast.error(`Failed to delete user: ${err.message || err}`)
        );
    }
  };

  const handleToggleRole = (id) => {
    dispatch(toggleUserRole(id))
      .unwrap()
      .then((res) => toast.success(`Role updated to ${res.role}`))
      .catch((err) =>
        toast.error(`Failed to update role: ${err.message || err}`)
      );
  };

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Manage Users
      </h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading users...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      ) : (
        <>
          {/* Desktop Table View  Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
            <table className="w-full min-w-[640px] border border-gray-300 dark:border-neutral-700 text-sm md:text-base">
              <thead className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300">
                <tr>
                  <th className="px-4 py-2 border dark:border-neutral-700 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 border dark:border-neutral-700 text-left">
                    Email
                  </th>
                  <th className="px-4 py-2 border dark:border-neutral-700 text-left">
                    Role
                  </th>
                  <th className="px-4 py-2 border dark:border-neutral-700 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200">
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-500 dark:text-neutral-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  >
                    <td className="px-4 py-2 border dark:border-neutral-700">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 border dark:border-neutral-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border dark:border-neutral-700 capitalize">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 border dark:border-neutral-700 space-x-2">
                      {user.role !== "admin" ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                            onClick={() => handleToggleRole(user._id)}
                          >
                            Toggle Role
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Admin (Locked)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on medium and larger screens */}
          <div className="md:hidden grid gap-4">
            {users.length === 0 ? (
              <p className="text-center py-4 text-gray-500 dark:text-neutral-400">
                No users found.
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white dark:bg-neutral-800 shadow rounded-lg p-4 space-y-3 border border-gray-200 dark:border-neutral-700"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-neutral-300 capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-neutral-300">
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    {user.role !== "admin" ? (
                      <>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                          onClick={() => handleToggleRole(user._id)}
                        >
                          Toggle Role
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Admin (Locked)
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserManagement;
