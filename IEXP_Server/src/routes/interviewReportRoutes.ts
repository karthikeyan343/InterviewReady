import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  getInterviewReport,
  getInterviewReportStatusController,
  retryInterviewReportGenerationController,
} from "../controllers/interviewReportController.js";

const router = Router();

router.get(
  "/:id/report",
  protect,
  getInterviewReport
);

router.get(
  "/:id/report-status",
  protect,
  getInterviewReportStatusController
);

router.post(
  "/:id/report/retry",
  protect,
  retryInterviewReportGenerationController
);

export default router;
