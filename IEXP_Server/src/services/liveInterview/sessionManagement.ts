import mongoose from "mongoose";
import Interview from "../../models/Interview.js";
import {
  SessionConflictError,
  SESSION_HEARTBEAT_TIMEOUT_MS,
} from "./types.js";

export const validateObjectId = (
  value: string,
  fieldName: string
): mongoose.Types.ObjectId => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return new mongoose.Types.ObjectId(value);
};

export const getInterview = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}) => {
  const interviewObjectId = validateObjectId(
    interviewId,
    "interview ID"
  );

  const interview = await Interview.findOne({
    _id: interviewObjectId,
    userId,
  });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  return interview;
};

export const verifyAndAcquireSession = async (
  interview: any,
  sessionId?: string,
  deviceId?: string
): Promise<string> => {
  const now = new Date();
  const currentActiveSession = interview.activeSessionId;
  const lastHeartbeat = interview.activeSessionLastHeartbeat;

  const isExpired =
    !lastHeartbeat ||
    now.getTime() - new Date(lastHeartbeat).getTime() > SESSION_HEARTBEAT_TIMEOUT_MS;

  if (currentActiveSession && !isExpired) {
    if (!sessionId || currentActiveSession !== sessionId) {
      throw new SessionConflictError(
        "This interview session is currently active on another device or tab. Simultaneous access is prevented to protect interview state."
      );
    }
  }

  const effectiveSessionId =
    sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(
    `[Live Interview] Session verifyAndAcquire: interviewId=${interview._id}, incomingSessionId=${sessionId || "none"}, effectiveSessionId=${effectiveSessionId}, mongoActiveSessionId=${currentActiveSession || "none"}, isExpired=${isExpired}`
  );

  // Atomic lease acquisition to prevent parallel race conditions
  const expireThreshold = new Date(Date.now() - SESSION_HEARTBEAT_TIMEOUT_MS);
  const updatedInterview = await Interview.findOneAndUpdate(
    {
      _id: interview._id,
      userId: interview.userId,
      $or: [
        { activeSessionId: null },
        { activeSessionId: effectiveSessionId },
        { activeSessionLastHeartbeat: null },
        { activeSessionLastHeartbeat: { $lt: expireThreshold } },
      ],
    },
    {
      $set: {
        activeSessionId: effectiveSessionId,
        activeSessionLastHeartbeat: now,
        ...(deviceId ? { activeSessionDeviceId: deviceId } : {}),
      },
    },
    { new: true }
  );

  if (!updatedInterview) {
    throw new SessionConflictError(
      "Concurrent session acquisition conflict. Another device acquired the session lease."
    );
  }

  interview.activeSessionId = effectiveSessionId;
  interview.activeSessionLastHeartbeat = now;
  if (deviceId) {
    interview.activeSessionDeviceId = deviceId;
  }

  return effectiveSessionId;
};

export const heartbeatLiveInterview = async ({
  interviewId,
  userId,
  sessionId,
}: {
  interviewId: string;
  userId: string;
  sessionId?: string;
}): Promise<{ active: boolean; activeSessionId: string | null; message: string }> => {
  const interviewObjectId = validateObjectId(
    interviewId,
    "interview ID"
  );
  const userObjectId = validateObjectId(
    userId,
    "user ID"
  );

  if (!sessionId) {
    throw new SessionConflictError("Session ID is required to heartbeat an active interview.");
  }

  const now = new Date();

  // Atomically update heartbeat timestamp while ensuring the session lease is currently held by this sessionId
  const updatedInterview = await Interview.findOneAndUpdate(
    {
      _id: interviewObjectId,
      userId: userObjectId,
      status: "In Progress",
      activeSessionId: sessionId,
    },
    {
      $set: {
        activeSessionLastHeartbeat: now,
      },
    },
    { new: true }
  );

  if (!updatedInterview) {
    const existing = await Interview.findOne({
      _id: interviewObjectId,
      userId: userObjectId,
    });

    if (!existing) {
      throw new Error("Interview not found.");
    }

    if (existing.status !== "In Progress") {
      return {
        active: false,
        activeSessionId: null,
        message: `Interview status is ${existing.status}`,
      };
    }

    // Session conflict: active session belongs to a different session ID or lease was stolen
    console.warn(
      `[Live Session Heartbeat Conflict] Interview: ${interviewId}, incomingSessionId: ${sessionId}, mongoActiveSessionId: ${existing.activeSessionId}`
    );
    throw new SessionConflictError("Session conflict: another device currently owns this interview.");
  }

  return {
    active: true,
    activeSessionId: sessionId,
    message: "Session heartbeat acknowledged.",
  };
};

export const leaveLiveInterview = async ({
  interviewId,
  userId,
  sessionId,
  elapsedSeconds,
}: {
  interviewId: string;
  userId: string;
  sessionId?: string;
  elapsedSeconds?: number;
}): Promise<{
  success: boolean;
  message: string;
  interview: {
    id: any;
    role: string;
    interviewType: string;
    difficulty: string;
    status: string;
    startedAt?: Date;
    activeDurationSeconds?: number;
    updatedAt: Date;
  };
}> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  const now = new Date();
  const isExpired =
    !interview.activeSessionLastHeartbeat ||
    now.getTime() - new Date(interview.activeSessionLastHeartbeat).getTime() >
      SESSION_HEARTBEAT_TIMEOUT_MS;

  if (interview.status === "In Progress" && interview.activeSessionId && !isExpired) {
    if (!sessionId || interview.activeSessionId !== sessionId) {
      throw new SessionConflictError(
        "Cannot leave interview: active session is currently running on another device."
      );
    }
  }

  if (typeof elapsedSeconds === "number" && Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0) {
    const wholeSeconds = Math.floor(elapsedSeconds);
    interview.activeDurationSeconds = Math.max(interview.activeDurationSeconds || 0, wholeSeconds);
  }

  if (interview.status !== "Completed") {
    interview.status = "Left";
    interview.activeSessionId = null;
    interview.activeSessionLastHeartbeat = null;
    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} marked as Left and session released (activeDurationSeconds: ${interview.activeDurationSeconds})`
    );
  } else if (typeof elapsedSeconds === "number" && Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0) {
    await interview.save();
  }

  return {
    success: true,
    message: "Interview status updated to Left.",
    interview: {
      id: interview._id,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      status: interview.status,
      startedAt: interview.startedAt,
      activeDurationSeconds: interview.activeDurationSeconds || 0,
      updatedAt: interview.updatedAt,
    },
  };
};

