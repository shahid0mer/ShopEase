import express from "express";
import {
  adminLogin,
  adminLogout,
  deleteUser,
  getAllOrders,
  getAllUsers,
  isAdminAuth,
  updateUserRole,
} from "../controllers/adminController.js";
import authRole from "../middlewares/authRole.js";
import { adminGetAllOrders } from "../controllers/orderController.js";

const adminRouter = express.Router();

adminRouter.put("/user/role/:id", authRole(["admin"]), updateUserRole);
adminRouter.delete("/users/:id", authRole(["admin"]), deleteUser);
adminRouter.post("/login", adminLogin);
adminRouter.get("/is-auth", authRole(["admin"]), isAdminAuth);
adminRouter.post("/logout", authRole(["admin"]), adminLogout);
adminRouter.get("/viewall", authRole(["admin"]), getAllOrders);
adminRouter.get("/users", authRole(["admin"]), getAllUsers);
adminRouter.get("/orders", authRole(["admin"]), adminGetAllOrders);

export default adminRouter;
