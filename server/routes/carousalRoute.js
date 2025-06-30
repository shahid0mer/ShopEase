import express from "express";
import uploadMemory from "../configs/multer.js";
const carousalRouter = express.Router();
import {
  getCarousels,
  addCarousel,
  deleteCarousel,
} from "../controllers/carousalController.js";
import authRole from "../middlewares/authRole.js";

carousalRouter.get("/get", getCarousels);
carousalRouter.post(
  "/add",
  uploadMemory.single("image"),
  authRole(["admin"]),
  addCarousel
);
carousalRouter.delete("/:id", authRole(["admin"]), deleteCarousel);

export default carousalRouter;
