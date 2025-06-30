import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Details Missing" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Exists" });
    }

    const hashedPasssword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPasssword,
      phone,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // csrf protection
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User Registered",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        _id: user._id,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};

// User Registration : /api/user/login

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Does not Exist" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User LoggedIn",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Check UserAuthorisation : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password"); // retrieve userdata from decodetoken excluding password
    console.log(user);

    return res.json({
      success: true,
      message: `${user.name} authorized`,
      user,
    });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "User Logged Out" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const viewProfile = async (req, res) => {
  try {
    console.log("📥 Incoming request from:", req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: req.user not set" });
    }

    const { name, email, role, _id } = req.user;

    return res.json({
      success: true,
      message: `${name} profile details`,
      user: { name, email, role, _id },
    });
  } catch (error) {
    console.log("❌ viewProfile Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// /api/user/updateprofile

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user._id;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
