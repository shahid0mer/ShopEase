import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// POST /api/user/upgrade-role
export const upgradeToSeller = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.role === "seller") {
      return res
        .status(400)
        .json({ success: false, message: "Already a seller" });
    }

    user.role = "seller".trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Role upgraded to seller",
      updatedUser: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name, // add whatever you need
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/user/profile
export const viewProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: `${user.name}'s profile`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/is-seller
export const isSellerAuth = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user || user.role !== "seller") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized as seller" });
    }

    return res.status(200).json({
      success: true,
      message: `${user.name} authorized as seller`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/update-profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Details Missing" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `${user.name}'s profile updated`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/seller/viewall/:seller_id
export const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Seller ID format." });
    }

    const objectIdSellerId = new mongoose.Types.ObjectId(sellerId);

    const products = await Product.find({ seller_id: objectIdSellerId })
      .populate("category_id") 
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve seller products.",
    });
  }
};

// GET /api/seller/orders/:seller_id
export const getSellerOrders = async (req, res) => {
  try {
    const { seller_id } = req.params;

    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
      "products.seller_id": seller_id,
    })
      .populate({
        path: "products.product_id",
        select: "name price images",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/logout
export const userLogout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ success: true, message: "User Logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
