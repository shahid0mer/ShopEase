import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../Features/User/authSlice";
import productReducer from "../Features/Product/productSlice";
import categoryReducer from "../Features/Product/categorySlice";
import cartReducer from "../Features/Cart/cartSlice";

// Auth persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

// Combine reducers
const combinedReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  product: productReducer,
  category: categoryReducer,
  cart: cartReducer,
});

// Root persist config
const rootPersistConfig = {
  key: "root",
  version: 1,
  storage,
  //   blacklist: ["auth"], // We already persist auth separately
};

// Export persisted reducer
export const rootReducer = persistReducer(rootPersistConfig, combinedReducer);
