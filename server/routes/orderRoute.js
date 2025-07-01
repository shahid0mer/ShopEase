import express from "express";
import {
  cancelOrder,
  createOrder,
  getSellerOrders,
  getUserOrder,
  placeOrderCOD,
  singleProductCheckout,
  verifyCartPaymentAndCreateOrder,
} from "../controllers/orderController.js";
import authRole from "../middlewares/authRole.js";
import { cartCheckout } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/cod", authRole(["user", "seller"]), placeOrderCOD);
orderRouter.get("/user/:user_id", authRole(["user", "seller"]), getUserOrder);
orderRouter.get("/seller", authRole(["seller"]), getSellerOrders);
orderRouter.post("/create", authRole(["user", "seller"]), createOrder);
orderRouter.put(
  "/cancel/:order_id",
  authRole(["user", "seller", "admin"]),
  cancelOrder
);
orderRouter.post(
  "/createsingle",
  authRole(["user", "seller"]),
  singleProductCheckout
);
orderRouter.post("/createcart", authRole(["user", "seller"]), cartCheckout);
orderRouter.post(
  "/verifycart",
  authRole(["user", "seller"]),
  verifyCartPaymentAndCreateOrder
);

export default orderRouter;
