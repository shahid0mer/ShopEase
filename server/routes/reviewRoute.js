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

reviewRouter.post("/add", authRole(["user"]), addReview);
reviewRouter.get("/:id", authRole(["user"]), getReview);
reviewRouter.put("/update/:id", authRole(["user"]), updateReview);
reviewRouter.delete("/delete/:id", authRole(["user"]), deleteReview);
reviewRouter.get("/product/:product_id", getAllReviews);

export default reviewRouter;
