import { Router } from "express";

import {
  uploadResume,
  getMyResume,
  viewMyResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.get(
  "/me",
  protect,
  getMyResume
);

router.get(
  "/view",
  protect,
  viewMyResume
);

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;