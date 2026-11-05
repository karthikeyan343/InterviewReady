import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  startLiveInterview,
  getLiveInterviewSession,
  leaveLiveInterview,
  heartbeatLiveInterview,
  SessionConflictError,
} from "../../services/liveInterviewService.js";

export const startLiveInterviewController = async (
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
    const deviceId = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined;

    const result = await startLiveInterview({
      interviewId,
      userId: req.userId,
      sessionId,
      deviceId,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Start live interview error:", error);

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
        : "Failed to start live interview.";

    res.status(400).json({
      message,
    });
  }
};

export const getLiveInterviewSessionController = async (
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

    const result = await getLiveInterviewSession({
      interviewId,
      userId: req.userId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get live interview session error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch live interview session.";

    res.status(400).json({
      message,
    });
  }
};

export const leaveLiveInterviewController = async (
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

    const result = await leaveLiveInterview({
      interviewId,
      userId: req.userId,
      sessionId,
      elapsedSeconds,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Leave live interview error:", error);

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
        : "Failed to leave live interview.";

    res.status(400).json({
      message,
    });
  }
};

export const heartbeatLiveInterviewController = async (
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

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      res.status(400).json({
        message: "Valid interview ID is required.",
      });
      return;
    }

    const rawSessionId = req.headers["x-session-id"] || req.body?.sessionId;
    const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined;

    const result = await heartbeatLiveInterview({
      interviewId,
      userId: req.userId,
      sessionId,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Heartbeat live interview error:", error);

    if (error instanceof SessionConflictError || error?.code === "SESSION_CONFLICT") {
      res.status(409).json({
        message: error.message,
        code: "SESSION_CONFLICT",
      });
      return;
    }

    res.status(400).json({
      message: error instanceof Error ? error.message : "Heartbeat failed.",
    });
  }
};

