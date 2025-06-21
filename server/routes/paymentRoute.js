import express from "express";
import {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentHistory,
} from "../controllers/paymentController.js";
import authRole from "../middlewares/authRole.js";

const paymentRouter = express.Router();

paymentRouter.post("/create", authRole(["user"]), createPayment);
paymentRouter.post("/verify", authRole(["user"]), verifyPayment);
paymentRouter.get("/status/:paymentId", getPaymentStatus);
paymentRouter.get("/history", getPaymentHistory);

export default paymentRouter;
