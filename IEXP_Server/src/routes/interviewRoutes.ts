import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createInterview,
  getDashboardData,
  getAllInterviews,
} from "../controllers/interviewController.js";

const router = Router();

router.post(
  "/",
  protect,
  createInterview
);

router.get(
  "/",
  protect,
  getAllInterviews
);

router.get(
  "/dashboard",
  protect,
  getDashboardData
);

export default router;