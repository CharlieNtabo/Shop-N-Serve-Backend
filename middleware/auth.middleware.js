import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not Authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Auth middleware failure" });
  }
};

export const adminOrSuperadminOnly = async (req, res, next) => {
  try {
    if (
      req.user &&
      (req.user.role === "admin" || req.user.role === "superadmin")
    ) {
      next();
    }
  } catch (error) {
    res
      .status(401)
      .json({ message: "Only admins and superadmins have access." });
  }
};

export const superadminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "superadmin") {
      next();
    }
  } catch (error) {
    req.status(401).json({ message: "Only superadmins have access." });
  }
};
