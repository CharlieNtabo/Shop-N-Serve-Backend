import express from "express";
import {
  adminOrSuperadminOnly,
  protect,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadMultipleImages } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/upload-images",
  protect,
  adminOrSuperadminOnly,
  upload.array("images", 5),
  uploadMultipleImages
);

export default router;
