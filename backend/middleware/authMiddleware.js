// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-otp -otpExpire");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized or token expired" });
  }
};
