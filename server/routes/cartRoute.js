import express from "express";
import {
  cartView,
  addCart,
  updateCart,
  removeCart,
  clearCart,
} from "../controllers/cartController.js";
import authRole from "../middlewares/authRole.js";

const cartRouter = express.Router();

cartRouter.get("/view/:user_id", authRole(["user", "seller"]), cartView);
cartRouter.post("/add", authRole(["user", "seller"]), addCart);
cartRouter.put("/update/:itemId", authRole(["user", "seller"]), updateCart);
cartRouter.delete("/remove/:itemId", authRole(["user", "seller"]), removeCart);
cartRouter.delete("/clear", authRole(["user", "seller"]), clearCart);

export default cartRouter;
