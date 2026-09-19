import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createLiveInterviewToken,
  startLiveInterviewController,
  saveLiveConversationTurnController,
  completeLiveInterviewController,
  getLiveInterviewSessionController,
} from "../controllers/liveInterviewController.js";

const router = Router();

router.get(
  "/:id/live/session",
  protect,
  getLiveInterviewSessionController
);

router.post(
  "/:id/live-token",
  protect,
  createLiveInterviewToken
);

router.post(
  "/:id/live/start",
  protect,
  startLiveInterviewController
);

router.post(
  "/:id/live/turn",
  protect,
  saveLiveConversationTurnController
);

router.post(
  "/:id/live/complete",
  protect,
  completeLiveInterviewController
);

export default router;