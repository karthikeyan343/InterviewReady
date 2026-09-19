import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  getInterviewReport,
} from "../controllers/interviewReportController.js";

const router = Router();

router.get(
  "/:id/report",
  protect,
  getInterviewReport
);

export default router;
