import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddresses,
} from "../Features/User/addressSlice.js";
import { useEffect } from "react";

const AddressForm = () => {
  const dispatch = useDispatch();
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = {
      name: "Full Name",
      phone: "Mobile Number",
      addressLine1: "Street Address",
      city: "City",
      state: "State/Province",
      pincode: "Pin Code",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !address[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const addressData = {
        name: address.name,
        phone: Number(address.phone),
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        isDefault: address.isDefault,
      };

      if (editingAddress) {
        await dispatch(
          updateAddress({
            id: editingAddress._id,
            address: addressData,
          })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addAddress(addressData)).unwrap();
        toast.success("Address added successfully");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    }
  };

  const resetForm = () => {
    setAddress({
      name: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setAddress({
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setEditingAddress(addr);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        toast.success("Address deleted");
      } catch (error) {
        toast.error(error.message || "Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
      toast.success("Default address updated");
    } catch (error) {
      toast.error(error.message || "Failed to update default address");
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto p-2 sm:p-4 lg:p-6
                 dark:bg-[var(--neutral-50)] dark:text-[var(--neutral-700)]"
    >
      <h2
        className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0
                   dark:text-[var(--neutral-700)]"
      >
        Your Addresses
      </h2>
      {loading && !addresses && (
        <p className="dark:text-[var(--neutral-500)] px-2 sm:px-0">
          Loading addresses...
        </p>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
        {addresses?.map((addr) => (
          <div
            key={addr._id}
            className={`border rounded-lg p-3 sm:p-4 relative
                       ${
                         addr.isDefault
                           ? "border-green-500 bg-green-50 dark:border-[var(--primary-dark)] dark:bg-[var(--primary-light)]"
                           : "border-gray-200 dark:border-[var(--neutral-200)] dark:bg-[var(--neutral-50)]"
                       }`}
          >
            {addr.isDefault && (
              <span
                className="absolute top-2 right-2 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded
                         dark:bg-[var(--primary-dark)]"
              >
                Default
              </span>
            )}
            <h3 className="font-medium text-sm sm:text-base pr-16 dark:text-[var(--neutral-700)]">
              {addr.name}
            </h3>
            <p className="text-sm dark:text-[var(--neutral-500)] mt-1">
              {addr.addressLine1}
            </p>
            <p className="text-sm dark:text-[var(--neutral-500)]">
              {addr.city}, {addr.state} {addr.pincode}
            </p>
            <p className="text-sm dark:text-[var(--neutral-500)]">
              {addr.country}
            </p>
            <p className="mt-2 text-sm dark:text-[var(--neutral-500)]">
              Phone: {addr.phone}
            </p>

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 hover:underline text-xs sm:text-sm
                           dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="text-red-600 hover:underline text-xs sm:text-sm
                           dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-green-600 hover:underline text-xs sm:text-sm
                             dark:text-green-400 dark:hover:text-green-300"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Form */}
      <div className="px-2 sm:px-0">
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-[var(--primary)] text-white px-4 py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-[var(--primary-dark)] mb-4 sm:mb-6
                     dark:bg-[var(--primary-dark)] dark:hover:bg-[var(--primary)]"
        >
          {addresses?.length ? "+ Add New Address" : "+ Add Your First Address"}
        </button>
      </div>

      {showForm && (
        <div
          className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 mx-2 sm:mx-0
                     dark:bg-[var(--neutral-50)] dark:shadow-lg dark:border-[var(--neutral-200)]"
        >
          <h3
            className="text-base sm:text-lg font-medium mb-3 sm:mb-4
                       dark:text-[var(--neutral-700)]"
          >
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  Pin Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1
                             dark:text-[var(--neutral-500)]"
                >
                  Country *
                </label>
                <select
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                             dark:bg-[var(--neutral-200)] dark:border-[var(--neutral-200)] dark:text-[var(--neutral-700)] dark:focus:ring-[var(--primary-light)]"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex items-start sm:items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={handleChange}
                id="defaultAddress"
                className="h-4 w-4 mt-0.5 sm:mt-0 text-emerald-600 focus:ring-[var(--primary)] border-gray-300 rounded
                           dark:text-[var(--primary-dark)] dark:focus:ring-[var(--primary)] dark:border-[var(--neutral-500)] dark:checked:bg-[var(--primary-dark)]"
              />
              <label
                htmlFor="defaultAddress"
                className="ml-2 block text-xs sm:text-sm text-gray-700 leading-tight sm:leading-normal
                           dark:text-[var(--neutral-500)]"
              >
                Set as default shipping address
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md hover:bg-gray-50
                           dark:border-[var(--neutral-200)] dark:bg-[var(--neutral-50)] dark:text-[var(--neutral-700)] dark:hover:bg-[var(--neutral-200)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-emerald-600 text-white rounded-md hover:bg-emerald-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }
                dark:bg-[var(--primary-dark)] dark:hover:bg-[var(--primary)] dark:disabled:bg-[var(--neutral-500)]`}
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
