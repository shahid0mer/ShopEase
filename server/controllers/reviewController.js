import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Add a new review: /api/review/add
export const addReview = async (req, res) => {
  try {
    const { product_id, rating, content } = req.body;
    const user_id = req.user._id;

    if (!product_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product ID and rating are required",
      });
    }

    const productExists = await Product.findById(product_id);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({ user_id, product_id });
    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this product" });
    }

    const review = await Review.create({
      user_id,
      product_id,
      rating,
      content,
    });

    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single review by ID: /api/review/:id
export const getReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id)
      .populate("user_id", "name")
      .populate("product_id", "name");

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review (only by owner): /api/review/update/:id
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;
    const { rating, content } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: id, user_id },
      { rating, content },
      { new: true }
    );

    if (!review) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or review not found",
      });
    }

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (only by owner): /api/review/delete/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    const review = await Review.findOneAndDelete({ _id: id, user_id });

    if (!review) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or review not found",
      });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a specific product: /api/review/product/:product_id
export const getAllReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const reviews = await Review.find({ product_id }).populate(
      "user_id",
      "name"
    );

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
