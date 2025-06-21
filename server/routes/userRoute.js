import express from "express";
import {
  isAuth,
  registerUser,
  userLogin,
  userLogout,
  viewProfile,
  updateProfile,
} from "../controllers/userController.js";

import { upgradeToSeller } from "../controllers/sellerController.js";

import authRole from "../middlewares/authRole.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.get("/is-auth", authRole(["user", "seller"]), isAuth);
userRouter.get("/logout", authRole(["user", "seller"]), userLogout);
userRouter.get("/profile", authRole(["user", "seller"]), viewProfile);
userRouter.put("/updateprofile", authRole(["user", "seller"]), updateProfile);
userRouter.put("/upgraderole", authRole(["user", "seller"]), upgradeToSeller);

export default userRouter;
