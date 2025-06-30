// Features/Auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMIN_LOGIN, ADMIN_LOGOUT, BASE_URL } from "../../utils/config";

export const fetchCurrentAdmin = createAsyncThunk(
  "admin/fetchCurrentAdmin",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        ADMIN_LOGIN,
        { email, password },
        { withCredentials: true }
      );

      if (data.user.role !== "admin") {
        return thunkAPI.rejectWithValue("Not an admin");
      }

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin"
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "admin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        ADMIN_LOGOUT,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const checkAdminAuth = createAsyncThunk(
  "admin/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${BASE_URL}/api/admin/is-auth`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Not authorized");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/viewall`, {
        withCredentials: true,
      });
      return res.data.orders;
    } catch (err) {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

//  Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        withCredentials: true,
      });
      return res.data.users;
    } catch (err) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

//  Delete User
export const deleteUserById = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue("User deletion failed");
    }
  }
);

//  Update User Role
export const toggleUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/user/role/${id}`,
        {},
        { withCredentials: true }
      );
      return { id, role: res.data.updatedRole };
    } catch (err) {
      return rejectWithValue("Role update failed");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: null,
    loading: false,
    error: null,
    orders: [],
    users: [],
    initialized: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
        state.loading = false;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      .addCase(toggleUserRole.fulfilled, (state, action) => {
        const { id, role } = action.payload;
        const user = state.users.find((u) => u._id === id);
        if (user) user.role = role;
      })
      .addCase(checkAdminAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
        state.loading = false;
      })
      .addCase(checkAdminAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
        state.loading = false;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
