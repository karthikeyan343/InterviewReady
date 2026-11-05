import mongoose from "mongoose";
import Interview from "../../models/Interview.js";
import LiveInterviewTurn from "../../models/LiveInterviewTurn.js";
import { getInterviewQuestionLimit } from "../../utils/interviewConfig.js";
import {
  SessionConflictError,
  SESSION_HEARTBEAT_TIMEOUT_MS,
  StartLiveInterviewResult,
  SaveLiveConversationTurnResult,
  LiveInterviewSessionResult,
} from "./types.js";
import { getInterview, verifyAndAcquireSession } from "./sessionManagement.js";

export const isAnsweredCandidateTurn = (turn: { speaker: string; text: string }): boolean => {
  if (turn.speaker !== "candidate") return false;
  const text = turn.text.trim().toLowerCase();
  return text.length > 0 && !text.startsWith("[skipped") && !text.startsWith("[no answer");
};

export const startLiveInterview = async ({
  interviewId,
  userId,
  sessionId,
  deviceId,
}: {
  interviewId: string;
  userId: string;
  sessionId?: string;
  deviceId?: string;
}): Promise<StartLiveInterviewResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status === "Completed") {
    throw new Error("Interview cannot start from Completed status.");
  }

  const effectiveSessionId = await verifyAndAcquireSession(interview, sessionId, deviceId);

  if (interview.status === "Not Started") {
    interview.status = "In Progress";
    interview.startedAt = new Date();
    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} started with session ${effectiveSessionId}`
    );
  } else if (interview.status === "Left") {
    interview.status = "In Progress";
    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} resumed from Left status with session ${effectiveSessionId}`
    );
  } else {
    await interview.save();
  }

  if (interview.status !== "In Progress") {
    throw new Error(
      `Interview cannot start from ${interview.status} status.`
    );
  }

  const questionLimit = getInterviewQuestionLimit(interview.difficulty);

  return {
    interview: {
      id: interview._id,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questionLimit,
      status: interview.status,
      startedAt: interview.startedAt,
      activeDurationSeconds: interview.activeDurationSeconds || 0,
    },
    sessionId: effectiveSessionId,
  };
};

export const saveLiveConversationTurn = async ({
  interviewId,
  userId,
  sessionId,
  speaker,
  text,
  timestamp,
  isQuestion,
}: {
  interviewId: string;
  userId: string;
  sessionId?: string;
  speaker: "interviewer" | "candidate";
  text: string;
  timestamp?: string | Date;
  isQuestion: boolean;
}): Promise<SaveLiveConversationTurnResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status !== "In Progress") {
    throw new Error(
      "Interview is not currently in progress."
    );
  }

  // Active session conflict verification
  const now = new Date();
  const isExpired =
    !interview.activeSessionLastHeartbeat ||
    now.getTime() - new Date(interview.activeSessionLastHeartbeat).getTime() >
      SESSION_HEARTBEAT_TIMEOUT_MS;

  if (interview.activeSessionId && !isExpired) {
    if (!sessionId || interview.activeSessionId !== sessionId) {
      console.warn(
        `[Live Session Turn Conflict] Interview: ${interviewId}, incomingSessionId: ${sessionId}, mongoActiveSessionId: ${interview.activeSessionId}`
      );
      throw new SessionConflictError("Cannot submit turn: interview is actively in progress on another device.");
    }
  }

  // Atomically update heartbeat without racing on full document save
  await Interview.updateOne(
    {
      _id: interview._id,
      userId: interview.userId,
    },
    {
      $set: {
        activeSessionLastHeartbeat: now,
        ...(sessionId && (!interview.activeSessionId || isExpired)
          ? { activeSessionId: sessionId }
          : {}),
      },
    }
  );

  const cleanedText = text.trim();

  if (!cleanedText) {
    throw new Error(
      "Conversation text cannot be empty."
    );
  }

  const lastTurn = await LiveInterviewTurn.findOne({
    interviewId: interview._id,
  }).sort({
    sequence: -1,
  });

  // Prevent consecutive duplicate turns from same speaker with identical text
  if (lastTurn && lastTurn.speaker === speaker && lastTurn.text === cleanedText) {
    const totalTurns = await LiveInterviewTurn.countDocuments({
      interviewId: interview._id,
    });

    console.log(
      `[Live Interview] Skipping duplicate ${speaker} turn #${lastTurn.sequence}`
    );

    return {
      saved: true,
      speaker,
      sequence: lastTurn.sequence,
      turnId: lastTurn._id as mongoose.Types.ObjectId,
      text: cleanedText,
      totalTurns,
    };
  }

  let sequence = lastTurn ? lastTurn.sequence + 1 : 1;
  let turn: any;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      turn = await LiveInterviewTurn.create({
        interviewId: interview._id,
        sequence,
        speaker,
        text: cleanedText,
        isQuestion,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });
      break;
    } catch (err: any) {
      if (err?.code === 11000 && attempt < maxAttempts) {
        const latestTurn = await LiveInterviewTurn.findOne({
          interviewId: interview._id,
        }).sort({ sequence: -1 });
        sequence = latestTurn ? latestTurn.sequence + 1 : sequence + 1;
      } else {
        throw err;
      }
    }
  }

  const totalTurns = await LiveInterviewTurn.countDocuments({
    interviewId: interview._id,
  });

  console.log(
    `[Live Interview] Saved ${speaker} turn #${sequence}`
  );

  return {
    saved: true,
    speaker,
    sequence,
    turnId: turn._id,
    text: cleanedText,
    totalTurns,
  };
};

export const getLiveInterviewSession = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}): Promise<LiveInterviewSessionResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  const questionLimit = getInterviewQuestionLimit(
    interview.difficulty as "Easy" | "Medium" | "Hard"
  );

  const turns = await LiveInterviewTurn.find({
    interviewId: interview._id,
  }).sort({
    sequence: 1,
  });

  const questionTurns = turns.filter(
    (turn) => turn.speaker === "interviewer" && turn.isQuestion === true
  );

  const candidateAnsweredTurns = turns.filter(isAnsweredCandidateTurn);
  const interviewerTurns = turns.filter((t) => t.speaker === "interviewer");
  const candidateTurnList = turns.filter((t) => t.speaker === "candidate");

  const lastInterviewer = interviewerTurns.length > 0 ? interviewerTurns[interviewerTurns.length - 1] : null;
  const lastCandidate = candidateTurnList.length > 0 ? candidateTurnList[candidateTurnList.length - 1] : null;

  return {
    interview: {
      id: interview._id,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty as "Easy" | "Medium" | "Hard",
      questionLimit,
      status: interview.status,
      startedAt: interview.startedAt,
      endedAt: interview.endedAt,
      activeDurationSeconds: interview.activeDurationSeconds || 0,
    },
    stats: {
      totalQuestions: questionLimit,
      currentQuestion: questionTurns.length,
      answeredCount: candidateAnsweredTurns.length,
      minimumRequiredAnswers: Math.ceil(questionLimit * 0.5),
      activeDurationSeconds: interview.activeDurationSeconds || 0,
    },
    turns: turns.map((t) => ({
      sequence: t.sequence,
      speaker: t.speaker,
      text: t.text,
      isQuestion: t.isQuestion,
      timestamp: t.timestamp,
    })),
    lastInterviewerTurn: lastInterviewer?.text || null,
    lastCandidateTurn: lastCandidate?.text || null,
  };
};

