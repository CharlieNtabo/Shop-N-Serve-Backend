import express from "express";
import {
  firebaseLogin,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);
router.put("/update-profile", protect, updateUserProfile);
router.post("/firebase-login", firebaseLogin);

export default router;
