import express, { Router } from "express";
import userRouter from "./userRoute.js";
import adminRouter from "./adminRoute.js";
import sellerRouter from "./sellerRoute.js";
import cartRouter from "./cartRoute.js";
import productRouter from "./productRoute.js";
import addressRouter from "./adressRoute.js";
import orderRouter from "./orderRoute.js";
import reviewRouter from "./reviewRoute.js";
import categoryRouter from "./categoryRoute.js";
import paymentRouter from "./paymentRoute.js";
import razorRouter from "./razorpayRoute.js";
import carousalRouter from "./carousalRoute.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter);
router.use("/cart", cartRouter);
router.use("/product", productRouter);
router.use("/address", addressRouter);
router.use("/order", orderRouter);
router.use("/review", reviewRouter);
router.use("/category", categoryRouter);
router.use("/payment", paymentRouter);
router.use("/key", razorRouter);
router.use("/carousal", carousalRouter);

export default router;
