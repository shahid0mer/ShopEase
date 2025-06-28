import express from "express";
import authRole from "../middlewares/authRole.js";

const razorRouter = express.Router();
razorRouter.get("/razorkey", authRole(["user", "seller"]), (req, res) => {
  res.status(200).json({ key_id: process.env.RAZORPAY_KEY_ID });
});
export default razorRouter;
