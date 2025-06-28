import React from "react";
import { useState } from "react";
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

    // Enhanced validation
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

    // Validate phone number format
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

      console.log("sending", addressData);

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Addresses</h2>
      {loading && !addresses && <p>Loading addresses...</p>}
      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {addresses?.map((addr) => (
          <div
            key={addr._id}
            className={`border rounded-lg p-4 relative ${
              addr.isDefault
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            {addr.isDefault && (
              <span className="absolute top-2 right-2 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded">
                Default
              </span>
            )}
            <h3 className="font-medium">{addr.name}</h3>
            <p>{addr.addressLine1}</p>
            <p>
              {addr.city}, {addr.state} {addr.pincode}
            </p>
            <p>{addr.country}</p>
            <p className="mt-2">Phone: {addr.phone}</p>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Form */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-[var(--primary)] text-white px-4 py-2 rounded hover:bg-[var(--primary-dark)] mb-6"
      >
        {addresses?.length ? "+ Add New Address" : "+ Add Your First Address"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={handleChange}
                id="defaultAddress"
                className="h-4 w-4 text-emerald-600 focus:ring-[var(--primary)] border-gray-300 rounded"
              />
              <label
                htmlFor="defaultAddress"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default shipping address
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
