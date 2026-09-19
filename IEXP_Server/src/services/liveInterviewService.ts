import mongoose from "mongoose";

import Interview from "../models/Interview.js";
import LiveInterviewTurn from "../models/LiveInterviewTurn.js";
import InterviewReport from "../models/InterviewReport.js";

import {
  generateInterviewReportWithGemini,
} from "./geminiInterviewReportService.js";

import {
  getInterviewQuestionLimit,
} from "../utils/interviewConfig.js";

export interface StartLiveInterviewResult {
  interview: {
    id: mongoose.Types.ObjectId;
    role: string;
    interviewType: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questionLimit: number;
    status: string;
    startedAt?: Date;
  };
}

export interface SaveLiveConversationTurnResult {
  saved: boolean;
  speaker: "interviewer" | "candidate";
  sequence?: number;
  turnId?: mongoose.Types.ObjectId;
  text: string;
  totalTurns: number;
}

export interface CompleteLiveInterviewResult {
  completed: boolean;
  reportGenerated: boolean;
  reportStatus: "none" | "preparing" | "ready" | "failed";
  reportId?: mongoose.Types.ObjectId | null;
  answeredCount: number;
  questionLimit: number;
  minimumRequiredAnswers: number;
  message: string;
  id?: mongoose.Types.ObjectId | null;
  overallScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  summary?: string;
}

export interface LiveInterviewSessionResult {
  interview: {
    id: mongoose.Types.ObjectId;
    role: string;
    interviewType: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questionLimit: number;
    status: string;
    startedAt?: Date;
    endedAt?: Date;
  };
  stats: {
    totalQuestions: number;
    currentQuestion: number;
    answeredCount: number;
  };
  turns: Array<{
    sequence: number;
    speaker: "interviewer" | "candidate";
    text: string;
    isQuestion: boolean;
    timestamp: Date;
  }>;
  lastInterviewerTurn: string | null;
  lastCandidateTurn: string | null;
}

const validateObjectId = (
  value: string,
  fieldName: string
): mongoose.Types.ObjectId => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return new mongoose.Types.ObjectId(value);
};

const getInterview = async ({
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

export const startLiveInterview = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}): Promise<StartLiveInterviewResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status === "Not Started") {
    interview.status = "In Progress";
    interview.startedAt = new Date();

    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} started`
    );
  }

  if (interview.status !== "In Progress") {
    throw new Error(
      `Interview cannot start from ${interview.status} status.`
    );
  }

  const questionLimit =
    getInterviewQuestionLimit(
      interview.difficulty
    );

  return {
    interview: {
      id: interview._id,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questionLimit,
      status: interview.status,
      startedAt: interview.startedAt,
    },
  };
};

export const saveLiveConversationTurn = async ({
  interviewId,
  userId,
  speaker,
  text,
  timestamp,
  isQuestion,
}: {
  interviewId: string;
  userId: string;
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

  const cleanedText = text.trim();

  if (!cleanedText) {
    throw new Error(
      "Conversation text cannot be empty."
    );
  }

  const lastTurn =
    await LiveInterviewTurn.findOne({
      interviewId: interview._id,
    }).sort({
      sequence: -1,
    });

  // Prevent consecutive duplicate turns from same speaker with identical text
  if (lastTurn && lastTurn.speaker === speaker && lastTurn.text === cleanedText) {
    const totalTurns =
      await LiveInterviewTurn.countDocuments({
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

  let sequence =
    lastTurn
      ? lastTurn.sequence + 1
      : 1;

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
        timestamp: timestamp
          ? new Date(timestamp)
          : new Date(),
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

  const totalTurns =
    await LiveInterviewTurn.countDocuments({
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

  const candidateTurns = turns.filter(
    (turn) => turn.speaker === "candidate" && turn.text.trim().length > 0
  );

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
    },
    stats: {
      totalQuestions: questionLimit,
      currentQuestion: questionTurns.length,
      answeredCount: candidateTurns.length,
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

export const completeLiveInterview = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}): Promise<CompleteLiveInterviewResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  const questionLimit = getInterviewQuestionLimit(
    interview.difficulty as "Easy" | "Medium" | "Hard"
  );

  const minimumRequiredAnswers = Math.ceil(questionLimit * 0.5);

  // Idempotency check: if interview already completed
  if (interview.status === "Completed") {
    const existingReport = await InterviewReport.findOne({
      interviewId: interview._id,
      userId,
    });

    const answeredCount = await LiveInterviewTurn.countDocuments({
      interviewId: interview._id,
      speaker: "candidate",
      text: { $ne: "" },
    });

    return {
      completed: true,
      reportGenerated: !!existingReport,
      reportStatus: (existingReport?.status as any) || (existingReport ? "ready" : "none"),
      reportId: existingReport?._id || null,
      id: existingReport?._id || null,
      overallScore: existingReport?.overallScore ?? 0,
      technicalScore: existingReport?.technicalScore ?? 0,
      communicationScore: existingReport?.communicationScore ?? 0,
      problemSolvingScore: existingReport?.problemSolvingScore ?? 0,
      strengths: existingReport?.strengths || [],
      weaknesses: existingReport?.weaknesses || [],
      suggestions: existingReport?.suggestions || [],
      summary: existingReport?.summary || "",
      answeredCount,
      questionLimit,
      minimumRequiredAnswers,
      message: "Interview was already completed.",
    };
  }

  // Mark interview completed in database
  interview.status = "Completed";
  interview.endedAt = new Date();
  await interview.save();

  const turns = await LiveInterviewTurn.find({
    interviewId: interview._id,
  }).sort({
    sequence: 1,
  });

  const candidateTurns = turns.filter(
    (turn) => turn.speaker === "candidate" && turn.text.trim().length > 0
  );

  const answeredCount = candidateTurns.length;

  console.log(
    `[Live Interview] Completed interview ${interviewId}. Candidate answered ${answeredCount}/${questionLimit} questions (minimum: ${minimumRequiredAnswers})`
  );

  // If candidate answers are below 50% threshold, safely close without generating report
  if (answeredCount < minimumRequiredAnswers) {
    return {
      completed: true,
      reportGenerated: false,
      reportStatus: "none",
      reportId: null,
      id: null,
      answeredCount,
      questionLimit,
      minimumRequiredAnswers,
      message: `Interview closed. Answered ${answeredCount} of required ${minimumRequiredAnswers} questions for report generation.`,
    };
  }

  // At or above 50% threshold: check/create report in preparing status and trigger async generation
  const conversation = turns
    .filter((turn) => turn.text.trim().length > 0)
    .map((turn) => ({
      sequence: turn.sequence,
      speaker: turn.speaker,
      text: turn.text,
      timestamp: turn.timestamp,
    }));

  let report = await InterviewReport.findOne({
    interviewId: interview._id,
    userId,
  });

  let shouldTriggerAsync = false;

  if (!report) {
    report = await InterviewReport.create({
      interviewId: interview._id,
      userId: new mongoose.Types.ObjectId(userId),
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      summary: "Performance report is being prepared...",
      status: "preparing",
    });
    shouldTriggerAsync = true;
  } else if (report.status === "preparing") {
    shouldTriggerAsync = true;
  }

  if (shouldTriggerAsync) {
    const reportId = report._id;
    const role = interview.role;
    const interviewType = interview.interviewType;
    const difficulty = interview.difficulty;

    setImmediate(async () => {
      try {
        console.log(
          `[Live Interview] Asynchronously generating report for interview ${interviewId}...`
        );

        const generatedReport = await generateInterviewReportWithGemini({
          role,
          interviewType,
          difficulty,
          conversation,
        });

        await InterviewReport.findByIdAndUpdate(reportId, {
          overallScore: generatedReport.overallScore,
          technicalScore: generatedReport.technicalScore,
          communicationScore: generatedReport.communicationScore,
          problemSolvingScore: generatedReport.problemSolvingScore,
          strengths: generatedReport.strengths,
          weaknesses: generatedReport.weaknesses,
          suggestions: generatedReport.suggestions,
          summary: generatedReport.summary,
          status: "ready",
        });

        console.log(
          `[Live Interview] Asynchronous report generated successfully for interview ${interviewId}`
        );
      } catch (reportError) {
        console.error(
          `[Live Interview] Asynchronous report generation error for interview ${interviewId}:`,
          reportError
        );

        await InterviewReport.findByIdAndUpdate(reportId, {
          status: "failed",
          summary: "Failed to generate report due to AI service error.",
        });
      }
    });
  }

  return {
    completed: true,
    reportGenerated: true,
    reportStatus: "preparing",
    reportId: report._id,
    id: report._id,
    overallScore: report.overallScore,
    technicalScore: report.technicalScore,
    communicationScore: report.communicationScore,
    problemSolvingScore: report.problemSolvingScore,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    suggestions: report.suggestions,
    summary: report.summary,
    answeredCount,
    questionLimit,
    minimumRequiredAnswers,
    message: "Interview completed. Performance report is being prepared in the background.",
  };
};
