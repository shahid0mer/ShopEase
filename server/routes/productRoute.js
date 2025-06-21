import express from "express";
import uploadMemory from "../configs/multer.js";
import authRole from "../middlewares/authRole.js";
import multer from "multer";
import {
  addProduct,
  changeStock,
  getAllProducts,
  productView,
  updatefullProduct,
} from "../controllers/productController.js";
import { getPaginatedProductsWithFilter } from "../controllers/categoryController.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  uploadMemory.array("image"),
  authRole(["seller"]),
  addProduct
);
productRouter.get("/viewall", getAllProducts);
productRouter.get("/:id", productView);
productRouter.put("/update/:id", authRole(["seller"]), changeStock);
productRouter.put(
  "/updateproduct/:id",
  uploadMemory.array("image"),
  authRole(["seller"]),
  updatefullProduct
);

productRouter.get(
  "/category/:categoryId/paginated",
  getPaginatedProductsWithFilter
);

export default productRouter;
