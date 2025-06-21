import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

//Adminlogin :  /api/admin/login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });

      return res.json({ success: true, message: "Admin Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//Adminauth :  /api/admin/is-auth

export const isAdminAuth = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Admin Authorised",
    });
  } catch (error) {
    console.log(error.message);

    return res.json({ success: false, message: error.message });
  }
};

//AdminLogout :  /api/admin/logout

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Admin Logged Out" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// viewall orders : /api/admin/viewall
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("products")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
