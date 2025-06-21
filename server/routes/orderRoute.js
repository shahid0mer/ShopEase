import express from "express";
import {
  cancelOrder,
  createOrder,
  getUserOrder,
  placeOrderCOD,
} from "../controllers/orderController.js";
import authRole from "../middlewares/authRole.js";

const orderRouter = express.Router();
orderRouter.post("/cod", authRole(["user"]), placeOrderCOD);
orderRouter.get("/user/:user_id", authRole(["user"]), getUserOrder);
orderRouter.post("/create", authRole(["user"]), createOrder);
orderRouter.put("/cancel/:order_id", authRole(["user"]), cancelOrder);

export default orderRouter;
