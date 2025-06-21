import jwt from "jsonwebtoken";
const authAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.json({ success: false, message: "Not Authorised" });
  }

  try {
    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decodedToken.email === process.env.ADMIN_EMAIL) {
      if (!req.body) {
        req.body = {};
      }
      next();
    } else {
      return res.json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
