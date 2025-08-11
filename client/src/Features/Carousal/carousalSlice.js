import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_CAROUSAL } from "../../utils/config";
import { BASE_URL } from "../../utils/config";

export const fetchCarousels = createAsyncThunk(
  "carousel/fetchCarousels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_CAROUSAL, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch carousels"
      );
    }
  }
);
export const addCarousel = createAsyncThunk(
  "carousel/addCarousel",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/carousal/add`,
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);
export const deleteCarousel = createAsyncThunk(
  "carousel/deleteCarousel",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/carousal/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCarousels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarousels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarousels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCarousel.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteCarousel.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default carouselSlice.reducer;
