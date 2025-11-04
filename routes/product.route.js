import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  adminOrSuperadminOnly,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/create", protect, adminOrSuperadminOnly, createProduct);
router.put("/:id", protect, adminOrSuperadminOnly, updateProduct);
router.delete("/:id", protect, adminOrSuperadminOnly, deleteProduct);

export default router;
