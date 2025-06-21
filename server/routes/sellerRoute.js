import express from "express";
import {
  isSellerAuth,
  userLogout,
  viewProfile,
  updateProfile,
  getSellerProducts,
} from "../controllers/sellerController.js";
import authRole from "../middlewares/authRole.js";

const sellerRouter = express.Router();

sellerRouter.get("/is-auth", authRole(["seller"]), isSellerAuth);
sellerRouter.get("/logout", authRole(["seller"]), userLogout);
sellerRouter.get("/profile", authRole(["seller"]), viewProfile);
sellerRouter.put("/updateprofile", authRole(["seller"]), updateProfile);
sellerRouter.get("/viewall/:sellerId", authRole(["seller"]), getSellerProducts);

export default sellerRouter;
