import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.controller";

const router = express.Router();

(router.get("/", protect, getCart),
  router.post("/", protect, addToCart),
  router.put("/update", protect, updateCart),
  router.delete("/remove", protect, removeFromCart),
  router.delete("/clear", protect, clearCart));

export default router;
