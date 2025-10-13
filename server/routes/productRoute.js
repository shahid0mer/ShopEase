import express from "express";
import uploadMemory from "../configs/multer.js";
import authRole from "../middlewares/authRole.js";
import multer from "multer";
import {
  addProduct,
  changeStock,
  getAllProducts,
  getRandomProducts,
  productView,
  updatefullProduct,
} from "../controllers/productController.js";
import { getFilteredOrSearchedProducts } from "../controllers/categoryController.js";

const productRouter = express.Router();

productRouter.get("/list", getFilteredOrSearchedProducts);
productRouter.get("/top-picks", getRandomProducts);
productRouter.get("/viewall", getAllProducts);
productRouter.post(
  "/add",
  uploadMemory.array("image"),
  authRole(["seller"]),
  addProduct
);
productRouter.put("/update/:id", authRole(["seller"]), changeStock);
productRouter.put(
  "/updateproduct/:id",
  uploadMemory.array("image"),
  authRole(["seller"]),
  updatefullProduct
);
productRouter.get("/:id", productView);

export default productRouter;
