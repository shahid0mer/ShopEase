import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    console.log("Axios POST request body being sent:", reviewData);
    console.log("Axios POST URL:", `${BASE_URL}/api/review/add`);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/review/add`,
        reviewData,
        { withCredentials: true }
      );
      console.log("Axios post successful! Response data:", data);
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getReviewsForProduct = createAsyncThunk(
  "reviews/getReviewsForProduct",
  async (productId, { rejectWithValue }) => {
    console.log(productId);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/review/product/${productId}`,
        {
          withCredentials: true,
        }
      );
      return data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ reviewId, rating, content }, { rejectWithValue }) => {
    console.log(reviewId);

    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/review/update/${reviewId}`,
        { rating, content },
        {
          withCredentials: true,
        }
      );

      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/review/delete/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getAllReview = createAsyncThunk(
  "review/getAllReview",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/review/product/${productId}`,
        {
          withCredentials: true,
        }
      );
      return data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getReviewsForProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsForProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsForProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        const updatedReview = action.payload;

        const index = state.reviews.findIndex(
          (review) => review._id === updatedReview._id
        );

        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const deletedReviewId = action.payload;

        state.reviews = state.reviews.filter(
          (review) => review._id !== deletedReviewId
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getAllReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
