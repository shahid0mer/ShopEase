import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_CAROUSAL } from "../../utils/config";

// ✅ Async thunk to fetch carousels
export const fetchCarousels = createAsyncThunk(
  "carousel/fetchCarousels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_CAROUSAL);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch carousels"
      );
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
      });
  },
});

export default carouselSlice.reducer;
