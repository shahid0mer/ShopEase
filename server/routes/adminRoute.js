import express from "express";
import {
  adminLogin,
  adminLogout,
  getAllOrders,
  isAdminAuth,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/is-auth", authAdmin, isAdminAuth);
adminRouter.get("/logout", authAdmin, adminLogout);
adminRouter.get("/viewall", authAdmin, getAllOrders);

export default adminRouter;
