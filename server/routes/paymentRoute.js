import express from "express";
import { verifyPaymentAndCreateOrder } from "../controllers/paymentController.js";
import authRole from "../middlewares/authRole.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create",
  authRole(["user", "seller"]),
  verifyPaymentAndCreateOrder
);
// paymentRouter.post("/verify", authRole(["user", "seller"]), verifyPayment);
// paymentRouter.get(
//   "/status/:paymentId",
//   authRole(["user", "seller"]),
//   getPaymentStatus
// );
// paymentRouter.get("/history", authRole(["user", "seller"]), getPaymentHistory);

export default paymentRouter;
