import { Router } from "express";

import {
  uploadResume,
  getMyResume,
  viewMyResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  handleResumeUpload,
} from "../middleware/uploadMiddleware.js";

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
  handleResumeUpload,
  uploadResume
);

export default router;