import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  saveLiveConversationTurn,
  completeLiveInterview,
  SessionConflictError,
} from "../../services/liveInterviewService.js";

export const saveLiveConversationTurnController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    const rawId = req.params.id;
    const interviewId =
      typeof rawId === "string"
        ? rawId
        : Array.isArray(rawId)
          ? rawId[0]
          : undefined;

    if (!interviewId) {
      res.status(400).json({
        message: "Interview ID is required.",
      });
      return;
    }

    const {
      speaker,
      text,
      timestamp,
      isQuestion,
    } = req.body;

    if (
      speaker !== "interviewer" &&
      speaker !== "candidate"
    ) {
      res.status(400).json({
        message:
          'Speaker must be either "interviewer" or "candidate".',
      });
      return;
    }

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      res.status(400).json({
        message: "Conversation text is required.",
      });
      return;
    }

    if (typeof isQuestion !== "boolean") {
      res.status(400).json({
        message: "isQuestion must be a boolean.",
      });
      return;
    }

    const rawSessionId = req.headers["x-session-id"] || req.body?.sessionId;
    const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined;

    const result = await saveLiveConversationTurn({
      interviewId,
      userId: req.userId,
      sessionId,
      speaker,
      text: text.trim(),
      timestamp,
      isQuestion,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Save live conversation turn error:", error);

    if (error instanceof SessionConflictError || error?.code === "SESSION_CONFLICT") {
      res.status(409).json({
        message: error.message,
        code: "SESSION_CONFLICT",
      });
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to save live conversation turn.";

    res.status(400).json({
      message,
    });
  }
};

export const completeLiveInterviewController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    const rawId = req.params.id;
    const interviewId =
      typeof rawId === "string"
        ? rawId
        : Array.isArray(rawId)
          ? rawId[0]
          : undefined;

    if (!interviewId) {
      res.status(400).json({
        message: "Interview ID is required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      res.status(400).json({
        message: "Invalid interview ID.",
      });
      return;
    }

    const rawSessionId = req.headers["x-session-id"] || req.body?.sessionId;
    const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined;
    const rawElapsed = req.body?.elapsedSeconds;
    const elapsedSeconds =
      typeof rawElapsed === "number" && Number.isFinite(rawElapsed) ? rawElapsed : undefined;

    const result = await completeLiveInterview({
      interviewId,
      userId: req.userId,
      sessionId,
      elapsedSeconds,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Complete live interview error:", error);

    if (error instanceof SessionConflictError || error?.code === "SESSION_CONFLICT") {
      res.status(409).json({
        message: error.message,
        code: "SESSION_CONFLICT",
      });
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to complete live interview.";

    res.status(400).json({
      message,
    });
  }
};

