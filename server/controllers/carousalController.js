import Carousel from "../models/Carousal.js";
import connectCloudinary from "../configs/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// GET /api/carousels
export const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ createdAt: -1 });
    res.status(200).json(carousels);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch carousels" });
  }
};

// POST /api/carousels (admin)
export const addCarousel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    // ✅ Ensure Cloudinary config exists
    if (!cloudinary.config().cloud_name) {
      console.warn("Cloudinary not configured. Set via connectCloudinary().");
    }

    // ✅ Upload buffer via stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce/carousels" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    const newCarousel = new Carousel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      link: req.body.link,
      alt: req.body.alt,
      imageUrl: result.secure_url,
    });

    const saved = await newCarousel.save();
    res.status(201).json({ success: true, carousel: saved });
  } catch (err) {
    console.error("Error adding carousel:", err);
    res.status(500).json({ success: false, message: "Error adding carousel" });
  }
};

// DELETE /api/carousels/:id (admin)
export const deleteCarousel = async (req, res) => {
  try {
    const deleted = await Carousel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Carousel not found" });
    }
    res.status(200).json({ success: true, message: "Carousel deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
