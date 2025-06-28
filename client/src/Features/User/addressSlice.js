import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

// Async Thunks
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/address/add`,
        { address: addressData },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAddresses = createAsyncThunk(
  "address/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/address/view`, {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, address }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/address/update/${id}`,
        { address: address }, // <--- CRITICAL FIX: Wrap address in 'address' object
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/address/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/address/setdef/${id}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Proper initial state structure
const initialState = {
  addresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    resetAddressState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Add Address
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming backend returns { address: {...} }
        state.addresses.push(action.payload.address);
        if (action.payload.address.isDefault) {
          state.defaultAddress = action.payload.address;
        }
        if (action.payload.address?.isDefault) {
          state.defaultAddress = action.payload.address;
        }
      })

      // Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload.address._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload.address;
        }
        if (action.payload.address.isDefault) {
          state.defaultAddress = action.payload.address;
          // Update other addresses to not be default
          state.addresses.forEach((addr) => {
            if (addr._id !== action.payload.address._id) {
              addr.isDefault = false;
            }
          });
        }
      })

      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload
        );
        if (state.defaultAddress?._id === action.payload) {
          state.defaultAddress = null;
        }
      })

      // Set Default Address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Update all addresses
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === action.payload.address._id,
        }));
        state.defaultAddress = state.addresses.find(
          (addr) => addr._id === action.payload.address._id
        );
      })

      // New: Handle successful fetching of addresses
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses; // Assuming payload has an 'addresses' array
        // Also update defaultAddress if one exists in the fetched list
        state.defaultAddress =
          action.payload.addresses.find((addr) => addr.isDefault) || null;
      })

      // Common loading state - MOVED AFTER all addCase calls
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetAddressState } = addressSlice.actions;
export default addressSlice.reducer;
