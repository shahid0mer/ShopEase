import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Admin Login: POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin Auth: GET /api/admin/is-auth
export const isAdminAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Authorized",
      user,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

// Admin Logout: GET /api/admin/logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Admin Logged Out" });
  } catch (error) {
    console.log("Admin logout error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// View All Orders: GET /api/admin/viewall
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("products.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get all orders error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users: GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete User by ID: DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update User Role: PUT /api/admin/user/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot change role of an admin",
      });
    }

    user.role = user.role === "user" ? "seller" : "user";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}`,
      updatedRole: user.role,
    });
  } catch (error) {
    console.error("Update role error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating role",
    });
  }
};
