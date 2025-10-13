import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(" Token from cookies:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token. Not authorized" });
    }
    // console.log(" Token from cookies:", token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🧾 Decoded JWT:", decoded);

      const user = await User.findById(decoded.id);
      // console.log(" Fetched User:", user);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied for role: " + user.role,
        });
      }

      req.user = user;
      console.log(" req.user set:", req.user);
      next();
    } catch (error) {
      // console.log("Error in authRole:", error.message);
      // console.log(" Token from cookies:", token);
      res.status(401).json({ success: false, message: error.message });
    }
  };
};

export default authRole;
