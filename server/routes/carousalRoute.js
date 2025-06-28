import express from "express";
import uploadMemory from "../configs/multer.js";
const carousalRouter = express.Router();
import {
  getCarousels,
  addCarousel,
  deleteCarousel,
} from "../controllers/carousalController.js";

carousalRouter.get("/get", getCarousels);
carousalRouter.post("/add", uploadMemory.single("image"), addCarousel);
carousalRouter.delete("/:id", deleteCarousel);

export default carousalRouter;
