import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../Features/User/authSlice";
import productReducer from "../Features/Product/productSlice";
import categoryReducer from "../Features/Product/categorySlice";
import cartReducer from "../Features/Cart/cartSlice";
import addressReducer from "../Features/User/addressSlice";
import reviewReducer from "../Features/Reviews/reviewSlice";
import orderReducer from "../Features/Order/orderSlice";
import carousalreducer from "../Features/Carousal/carousalSlice";

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
  address: addressReducer,
  reviews: reviewReducer,
  order: orderReducer,
  carousel: carousalreducer,
});

// Root persist config
const rootPersistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["product"],
};

export const rootReducer = persistReducer(rootPersistConfig, combinedReducer);
