import express from "express";
import { getAllCategories } from "../controllers/categoryController.js";
import { getProductsByCategory } from "../controllers/productController.js";

const categoryRouter = express.Router();

categoryRouter.get("/view", getAllCategories);
categoryRouter.get("/:categoryId", getProductsByCategory);

export default categoryRouter;
