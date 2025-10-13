// features/product/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, RANDOMPRODUCT_URI } from "../../utils/config";
import {
  PRODUCT_URI,
  GET_SELLER_PRODUCTS_URL,
  CHANGE_STOCK_URI,
} from "../../utils/config";

// const PRODUCT_URI = `${BASE_URL}/api/product/add`;
// const GET_SELLER_PRODUCTS_URL = `${BASE_URL}/api/seller/viewall`;
// const CHANGE_STOCK_URI = `${BASE_URL}/api/product/update`;

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({ productData, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      images.forEach((img) => formData.append("image", img));

      const response = await axios.post(PRODUCT_URI, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Add failed");
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchByCategory",
  async (categoryId, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category/${categoryId}`);
      return res.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/product/${productId}`);
      return res.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getSellerProducts = createAsyncThunk(
  "seller/getSellerProducts",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${GET_SELLER_PRODUCTS_URL}/${sellerId}`,
        {
          withCredentials: true,
        }
      );

      return response.data.products;
    } catch (error) {
      console.error(
        "Error fetching seller products:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller products"
      );
    }
  }
);

export const updateProductStock = createAsyncThunk(
  "product/updateStock",
  async ({ productId, inStock }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${CHANGE_STOCK_URI}/${productId}`,
        {
          inStock,
        },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductsWithFilters = createAsyncThunk(
  "product/fetchProductsWithFilters",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(typeof value === "string" && value.toLowerCase() === "null")
        ) {
          const paramKey = key === "category" ? "categoryId" : key;
          queryParams.append(paramKey, value);
        }
      });
      console.log("Final query string:", queryParams.toString());

      const response = await axios.get(
        `${BASE_URL}/api/product/list?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchRandomProducts = createAsyncThunk(
  "product/fetchRandomProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RANDOMPRODUCT_URI}`, {
        withCredentials: true,
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch random products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    filteredProducts: [],
    topPicks: [],
    loading: false,
    error: null,
    successMessage: "",
    sellerProducts: [],
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.products.push(action.payload.product);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        (state.loading = false), (state.categoryProducts = action.payload);
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(fetchProductById.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        (state.loading = false), (state.ProductInfo = action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts = action.payload;
        state.error = null;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sellerProducts = [];
      })
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, inStock } = action.meta.arg;
        const index = state.sellerProducts.findIndex(
          (p) => p._id === productId
        );
        if (index !== -1) {
          state.sellerProducts[index].inStock = inStock;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload.products;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
        state.totalProducts = action.payload.total;
      })
      .addCase(fetchProductsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRandomProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topPicks = action.payload;
      })
      .addCase(fetchRandomProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearMessages } = productSlice.actions;

export default productSlice.reducer;
