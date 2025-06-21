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

addressRouter.post("/add", authRole(["user"]), addAddress);
addressRouter.get("/view", authRole(["user"]), viewAddress);
addressRouter.get("/getdef", authRole(["user"]), getDefaultAddress);
addressRouter.get("/:id", authRole(["user"]), viewSingleAddress);
addressRouter.put("/update/:id", authRole(["user"]), updateAddress);
addressRouter.delete("/delete/:id", authRole(["user"]), deleteAddress);
addressRouter.put("/setdef/:id", authRole(["user"]), setDefaultAddress);

export default addressRouter;
