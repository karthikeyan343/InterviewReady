import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createLiveInterviewToken,
  startLiveInterviewController,
  saveLiveConversationTurnController,
  completeLiveInterviewController,
  getLiveInterviewSessionController,
  leaveLiveInterviewController,
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

router.post(
  "/:id/leave",
  protect,
  leaveLiveInterviewController
);

router.post(
  "/:id/live/leave",
  protect,
  leaveLiveInterviewController
);

export default router;