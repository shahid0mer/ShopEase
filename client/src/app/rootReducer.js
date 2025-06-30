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
import darkModeReducer from "../Features/DarkMode/darkModeSlice";
import adminReducer from "../Features/Admin/adminSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};
const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["user", "isAuthenticated", "initialized"],
};

const combinedReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  admin: persistReducer(adminPersistConfig, adminReducer),
  product: productReducer,
  category: categoryReducer,
  cart: cartReducer,
  address: addressReducer,
  reviews: reviewReducer,
  order: orderReducer,
  carousel: carousalreducer,
  darkMode: darkModeReducer,
});

const rootPersistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["product"],
};

export const rootReducer = persistReducer(rootPersistConfig, combinedReducer);
