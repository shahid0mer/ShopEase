// User Registration : /api/user/register

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Details Missing" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Exists" });
    }

    const hashedPasssword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPasssword });

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
      },
    });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};

// User Registration : /api/user/login

// userController.js (or wherever userLogin is defined)
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

    // --- CHANGE THIS LINE ---
    // Make sure _id is included in the user object returned on login
    return res.json({
      success: true,
      message: "User LoggedIn",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }, // <-- ADDED _id
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

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.user._id;

    if (!name || !email) {
      return res.json({ success: false, message: "Details Missing" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    return res.json({
      success: true,
      message: `${user.name} profile updated`,
      user,
    });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};
