import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PURGE } from "redux-persist";
import {
  BASE_URL,
  LOGIN_URL,
  REGISTER_URL,
  UPGRADE_USER,
  GET_PROFILE,
  LOGOUT_USER,
  CHECK_AUTH,
} from "../../utils/config";

// API URLs
// const LOGIN_URL = `${BASE_URL}/api/user/login`;
// const REGISTER_URL = `${BASE_URL}/api/user/register`;
// const UPGRADE_USER = `${BASE_URL}/api/user/upgraderole`;
// const GET_PROFILE = `${BASE_URL}/api/user/profile`;
// const LOGOUT_USER = `${BASE_URL}/api/user/logout`;
// const CHECK_AUTH = `${BASE_URL}/api/user/is-auth`;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const { email, password } = credentials;

      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        return response.data.user;
      } else {
        return thunkAPI.rejectWithValue(
          response.data.message || "Login Failed"
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER_URL, userData, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Registration failed"
      );
    }
  }
);

export const upgradeSeller = createAsyncThunk(
  "auth/upgradetoseller",
  async (_, thunkAPI) => {
    try {
      const response = await axios.put(
        UPGRADE_USER,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        return response.data.updatedUser;
      } else {
        return thunkAPI.rejectWithValue(
          response.data.message || "upgrade failed"
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Upgrade failed"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(GET_PROFILE, { withCredentials: true });

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(LOGOUT_USER, { withCredentials: true });

      // 2. Purge Redux Persist storage
      dispatch({ type: PURGE, key: "root", result: () => null });

      return response.data;
    } catch (error) {
      dispatch({ type: PURGE, key: "root", result: () => null });

      return { success: true };
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(CHECK_AUTH, {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log("registerd :", state.user);
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        return state;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(upgradeSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(upgradeSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
