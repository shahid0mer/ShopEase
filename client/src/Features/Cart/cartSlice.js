// src/Features/Cart/cartSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { checkAuthStatus, logoutUser } from "../User/authSlice";
import { BASE_URL } from "../../utils/config";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
  status: "idle",
  error: null,
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (product, thunkAPI) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/cart/add`, product, {
        withCredentials: true,
      });

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return {
        cartItems: data.cart.items,
        totalQuantity: data.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: data.cart.items.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.offerPrice || item.product_id?.price || 0) *
              item.quantity,
          0
        ),
      };
    } catch (err) {
      console.error("Add to cart error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCartAsync",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userId = state.auth.user?._id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(`${BASE_URL}/cart/view/${userId}`, {
        withCredentials: true,
      });

      return {
        cartItems: response.data.cart.items,
        totalQuantity: response.data.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: response.data.cart.items.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.offerPrice || item.product_id?.price || 0) *
              item.quantity,
          0
        ),
      };
    } catch (err) {
      console.error("Fetch cart error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateCartItemAsync",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/cart/update/${itemId}`,
        { quantity },
        { withCredentials: true }
      );

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return {
        cartItems: data.cart.items,
        totalQuantity: data.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: data.cart.items.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.offerPrice || item.product_id?.price || 0) *
              item.quantity,
          0
        ),
      };
    } catch (err) {
      console.error("Update cart error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeCartItemAsync",
  async (itemId, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/cart/remove/${itemId}`,
        { withCredentials: true }
      );

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return {
        cartItems: data.cart.items,
        totalQuantity: data.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: data.cart.items.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.offerPrice || item.product_id?.price || 0) *
              item.quantity,
          0
        ),
      };
    } catch (err) {
      console.error("Remove item error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart cases
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.cartItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
        console.log("Added to cart - items:", state.cartItems);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch cart cases
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.cartItems = action.payload.cartItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update item cases
      .addCase(updateQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.cartItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Remove item cases
      .addCase(removeFromCart.pending, (state) => {
        // state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.cartItems;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Clear cart on logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        state.status = "idle";
        state.error = null;
      })

      // Clear cart if not authenticated
      .addCase(checkAuthStatus.rejected, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
