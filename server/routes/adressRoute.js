import express from "express";
import authRole from "../middlewares/authRole.js";
import {
  addAddress,
  deleteAddress,
  getDefaultAddress,
  setDefaultAddress,
  updateAddress,
  viewAddress,
  viewSingleAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", authRole(["user", "seller"]), addAddress);
addressRouter.get("/view", authRole(["user", "seller"]), viewAddress);
addressRouter.get("/getdef", authRole(["user", "seller"]), getDefaultAddress);
addressRouter.get("/:id", authRole(["user", "seller"]), viewSingleAddress);
addressRouter.put("/update/:id", authRole(["user", "seller"]), updateAddress);
addressRouter.delete(
  "/delete/:id",
  authRole(["user", "seller"]),
  deleteAddress
);
addressRouter.patch(
  "/setdef/:id",
  authRole(["user", "seller"]),
  setDefaultAddress
);

export default addressRouter;
