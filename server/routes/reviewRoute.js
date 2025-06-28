import express from "express";

const reviewRouter = express.Router();
import {
  addReview,
  getReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import authRole from "../middlewares/authRole.js";

reviewRouter.post("/add", authRole(["user", "seller"]), addReview);
reviewRouter.get("/:id", authRole(["user", "seller"]), getReview);
reviewRouter.put("/update/:id", authRole(["user", "seller"]), updateReview);
reviewRouter.delete("/delete/:id", authRole(["user", "seller"]), deleteReview);
reviewRouter.get("/product/:product_id", getAllReviews);

export default reviewRouter;
