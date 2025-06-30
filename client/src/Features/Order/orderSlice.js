// Features/Order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CREATE_ORDER,
  ORDER_COD,
  ONLINE_ORDER,
  SINGLE_ORDER,
  BASE_URL,
  CART_CHECKOUT,
  VER_CART,
} from "../../utils/config";

// 1. Create Order
export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(CREATE_ORDER, orderData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyPaymentAsync = createAsyncThunk(
  "order/verifyPayment",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/payment/verify",
        verificationData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const singleProductCheckout = createAsyncThunk(
  "checkout/singleProduct",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const { productId, quantity, address, paymentType, amount, currency } =
        checkoutData;

      if (!productId || !quantity || !address || !amount || !currency) {
        throw new Error(
          "Product ID, quantity, address, amount, and currency are required"
        );
      }

      const { name, phone, addressLine1, city, state, country, pincode } =
        address;
      if (
        !name ||
        !phone ||
        !addressLine1 ||
        !city ||
        !state ||
        !country ||
        !pincode
      ) {
        throw new Error("Complete address information is required");
      }

      console.log("Thunk: Sending to backend:", {
        productId,
        quantity,
        address,
        paymentType,
        amount,
        currency,
      });

      const response = await axios.post(
        SINGLE_ORDER,
        {
          productId,
          quantity,
          address,
          paymentType,
          amount,
          currency,
        },
        { withCredentials: true }
      );

      console.log("Thunk: Received from backend:", response.data);

      if (paymentType === "ONLINE") {
        if (
          response.data &&
          response.data.requiresPayment &&
          response.data.paymentData &&
          response.data.paymentData.orderId
        ) {
          return {
            requiresPayment: true,
            paymentData: {
              id: response.data.paymentData.orderId,
              amount: response.data.paymentData.amount,
              currency: response.data.paymentData.currency,
            },
          };
        } else {
          console.error(
            "Backend response missing expected fields for online payment:",
            response.data
          );
          throw new Error(
            "Backend did not return expected payment data structure for online payment. Missing orderId or other payment details."
          );
        }
      }

      // For COD, just return the data received from backend which should contain the order
      // Assuming COD response.data is the full order object or contains it.
      // If it's just a success message, you might need to adjust based on actual COD response.
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else if (err.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);
export const placeOrderCOD = createAsyncThunk(
  "order/placeOrderCOD",
  async ({ items, address }, thunkAPI) => {
    try {
      const response = await axios.post(
        ORDER_COD,
        { items, address },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        return thunkAPI.rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const placeOnlineOrder = createAsyncThunk(
  "order/placeOnlineOrder",
  async (paymentData, thunkAPI) => {
    try {
      console.log("📦 Sending payment data to backend:", paymentData);

      const response = await axios.post(ONLINE_ORDER, paymentData, {
        withCredentials: true,
      });

      console.log("Redux slice - Backend response:", response.data);

      if (!response.data.success) {
        // Log the full response data for better debugging
        console.error(
          "Backend response for online order failed:",
          response.data
        );
        return thunkAPI.rejectWithValue(
          response.data.message || "Online order placement failed."
        );
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error in placeOnlineOrder thunk:",
        error.response?.data || error.message
      );
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      // Construct the URL dynamically using the userId
      // Ensure you have `withCredentials: true` for authentication
      const response = await axios.get(`${BASE_URL}/api/order/user/${userId}`, {
        withCredentials: true,
      });
      console.log("Fetched user orders:", response.data);
      return response.data.orders;
    } catch (error) {
      console.error(
        "Error fetching user orders:",
        error.response?.data || error.message
      );
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const placeCartOrder = createAsyncThunk(
  "order/placeCartOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(CART_CHECKOUT, orderPayload, {
        headers: {
          "Content-Type": "application/json", // ✅ ensure JSON
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Backend error payload", err.response?.data);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const placeOnlineOrderCart = createAsyncThunk(
  "order/placeOnlineOrder",
  async (
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        VER_CART,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderDetails,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const cancelOrderById = createAsyncThunk(
  "order/cancelOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/order/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    orderInfo: null,
    paymentInfo: null,
    success: false,
    requiresPayment: false,
    userOrders: [],
  },
  reducers: {
    clearOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.orderInfo = null;
      state.paymentInfo = null;
      state.success = false;
      state.userOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
        state.success = true;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Order creation failed";
      })

      .addCase(verifyPaymentAsync.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(singleProductCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(singleProductCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload.order;
        state.requiresPayment = action.payload.requiresPayment;
        if (action.payload.requiresPayment) {
          state.paymentInfo = action.payload.paymentData;
        }
        state.success = !action.payload.requiresPayment; // Mark as success immediately for COD
      })
      .addCase(singleProductCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Checkout failed";
      })
      .addCase(placeOrderCOD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderCOD.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
        state.error = null;
      })
      .addCase(placeOrderCOD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderInfo = null;
      })
      .addCase(placeOnlineOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOnlineOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload.order;
        state.error = null;
      })
      .addCase(placeOnlineOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || JSON.stringify(action.payload);
        state.orderInfo = null;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userOrders = [];
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userOrders = [];
      })
      .addCase(placeCartOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.orderError = null;
      })
      .addCase(placeCartOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(placeCartOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
