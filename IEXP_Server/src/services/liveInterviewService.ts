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
  reportStatus: "NotRequired" | "Processing" | "Completed" | "Failed" | "none" | "preparing" | "ready" | "failed";
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

export interface ReportStatusResult {
  status: "NotRequired" | "Processing" | "Completed" | "Failed";
  reportId?: mongoose.Types.ObjectId | null;
  overallScore?: number | null;
  error?: string | null;
  errorMessage?: string | null;
  answeredCount?: number;
  minimumRequiredAnswers?: number;
  message?: string;
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
    minimumRequiredAnswers: number;
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
  } else if (interview.status === "Left") {
    interview.status = "In Progress";
    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} resumed from Left status`
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

const isAnsweredCandidateTurn = (turn: { speaker: string; text: string }): boolean => {
  if (turn.speaker !== "candidate") return false;
  const text = turn.text.trim().toLowerCase();
  return text.length > 0 && !text.startsWith("[skipped") && !text.startsWith("[no answer");
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
    },
    stats: {
      totalQuestions: questionLimit,
      currentQuestion: questionTurns.length,
      answeredCount: candidateAnsweredTurns.length,
      minimumRequiredAnswers: Math.ceil(questionLimit * 0.5),
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

const activeReportGenerations = new Set<string>();

export const executeAsyncReportGeneration = async (
  interviewId: string,
  userId: string
): Promise<void> => {
  const lockKey = interviewId.toString();

  if (activeReportGenerations.has(lockKey)) {
    console.log(
      `[Report Worker] Generation already active for interview ${interviewId}. Skipping duplicate spawn.`
    );
    return;
  }

  activeReportGenerations.add(lockKey);

  try {
    const interviewObjectId = validateObjectId(interviewId, "interview ID");

    const interview = await Interview.findOne({
      _id: interviewObjectId,
      userId,
    });

    if (!interview) {
      console.error(
        `[Report Worker] Interview ${interviewId} not found for report generation.`
      );
      return;
    }

    const turns = await LiveInterviewTurn.find({
      interviewId: interview._id,
    }).sort({
      sequence: 1,
    });

    const conversation = turns
      .filter((turn) => turn.text.trim().length > 0)
      .map((turn) => ({
        sequence: turn.sequence,
        speaker: turn.speaker,
        text: turn.text.trim(),
        timestamp: turn.timestamp,
      }));

    if (conversation.length === 0) {
      console.warn(
        `[Report Worker] No conversation turns found for interview ${interviewId}`
      );
      await InterviewReport.findOneAndUpdate(
        { interviewId: interview._id, userId },
        {
          status: "Failed",
          summary: "No conversation turns were recorded for this interview.",
          errorMessage: "Zero turns recorded in conversation.",
        },
        { upsert: true }
      );
      return;
    }

    console.log(
      `[Report Worker] Generating AI report for interview ${interviewId} (${conversation.length} turns, Role: ${interview.role}, Type: ${interview.interviewType}, Difficulty: ${interview.difficulty})...`
    );

    const generatedReport = await generateInterviewReportWithGemini({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      conversation,
    });

    await InterviewReport.findOneAndUpdate(
      { interviewId: interview._id, userId },
      {
        overallScore: generatedReport.overallScore,
        technicalScore: generatedReport.technicalScore,
        communicationScore: generatedReport.communicationScore,
        problemSolvingScore: generatedReport.problemSolvingScore,
        strengths: generatedReport.strengths,
        weaknesses: generatedReport.weaknesses,
        suggestions: generatedReport.suggestions,
        summary: generatedReport.summary,
        status: "Completed",
        errorMessage: null,
      },
      { upsert: true, new: true }
    );

    console.log(
      `[Report Worker] Successfully generated and persisted report for interview ${interviewId} (Overall Score: ${generatedReport.overallScore}%)`
    );
  } catch (error: any) {
    const providerErrorMessage =
      error instanceof Error ? error.message : String(error);

    console.error(
      `[Report Worker] Report generation failed for interview ${interviewId}:`,
      error
    );

    await InterviewReport.findOneAndUpdate(
      { interviewId: new mongoose.Types.ObjectId(interviewId), userId },
      {
        status: "Failed",
        summary: "Failed to generate report due to AI service error.",
        errorMessage: providerErrorMessage,
      },
      { upsert: true }
    );
  } finally {
    activeReportGenerations.delete(lockKey);
  }
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

  const turns = await LiveInterviewTurn.find({
    interviewId: interview._id,
  }).sort({
    sequence: 1,
  });

  const candidateTurns = turns.filter(isAnsweredCandidateTurn);

  const answeredCount = candidateTurns.length;

  // Mark interview completed in database if not already completed
  if (interview.status !== "Completed") {
    interview.status = "Completed";
    interview.endedAt = new Date();
    await interview.save();
  }

  console.log(
    `[Live Interview] Completed interview ${interviewId}. Candidate answered ${answeredCount}/${questionLimit} questions (minimum for report: ${minimumRequiredAnswers})`
  );

  // 50% Threshold Check: If below threshold, no report is required
  if (answeredCount < minimumRequiredAnswers) {
    return {
      completed: true,
      reportGenerated: false,
      reportStatus: "NotRequired",
      reportId: null,
      id: null,
      answeredCount,
      questionLimit,
      minimumRequiredAnswers,
      message: `Interview closed. Performance report not required (answered ${answeredCount} of required ${minimumRequiredAnswers} questions).`,
    };
  }

  // At or above 50% threshold: eligible for report generation
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
      status: "Processing",
    });
    shouldTriggerAsync = true;
  } else if (
    report.status === "Processing" ||
    report.status === "preparing" ||
    report.status === "Failed" ||
    report.status === "failed"
  ) {
    report.status = "Processing";
    report.summary = "Performance report is being prepared...";
    report.errorMessage = undefined;
    await report.save();
    shouldTriggerAsync = true;
  }

  if (shouldTriggerAsync) {
    const rawInterviewId = interview._id.toString();
    setImmediate(() => {
      void executeAsyncReportGeneration(rawInterviewId, userId);
    });
  }

  const isAlreadyCompleted =
    report.status === "Completed" || report.status === "ready";

  return {
    completed: true,
    reportGenerated: isAlreadyCompleted,
    reportStatus: (report.status as any) || "Processing",
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
    message: isAlreadyCompleted
      ? "Interview completed and report is ready."
      : "Interview completed. Performance report is being prepared asynchronously in the background.",
  };
};

export const retryInterviewReportGeneration = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}): Promise<ReportStatusResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status !== "Completed") {
    throw new Error("Interview must be completed before generating a report.");
  }

  const questionLimit = getInterviewQuestionLimit(
    interview.difficulty as "Easy" | "Medium" | "Hard"
  );

  const minimumRequiredAnswers = Math.ceil(questionLimit * 0.5);

  const turns = await LiveInterviewTurn.find({
    interviewId: interview._id,
  }).sort({
    sequence: 1,
  });

  const candidateTurns = turns.filter(isAnsweredCandidateTurn);

  const answeredCount = candidateTurns.length;

  if (answeredCount < minimumRequiredAnswers) {
    throw new Error(
      `Report generation is not eligible. Candidate answered ${answeredCount} of required ${minimumRequiredAnswers} questions.`
    );
  }

  let report = await InterviewReport.findOne({
    interviewId: interview._id,
    userId,
  });

  if (report && (report.status === "Completed" || report.status === "ready")) {
    return {
      status: "Completed",
      reportId: report._id,
      overallScore: report.overallScore,
      answeredCount,
      minimumRequiredAnswers,
      message: "Report is already completed.",
    };
  }

  if (report && (report.status === "Processing" || report.status === "preparing")) {
    return {
      status: "Processing",
      reportId: report._id,
      answeredCount,
      minimumRequiredAnswers,
      message: "Report generation is already processing.",
    };
  }

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
      status: "Processing",
    });
  } else {
    report.status = "Processing";
    report.summary = "Performance report is being prepared...";
    report.errorMessage = undefined;
    await report.save();
  }

  const rawInterviewId = interview._id.toString();
  setImmediate(() => {
    void executeAsyncReportGeneration(rawInterviewId, userId);
  });

  return {
    status: "Processing",
    reportId: report._id,
    answeredCount,
    minimumRequiredAnswers,
    message: "Report generation retry started.",
  };
};

export const getInterviewReportStatus = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}): Promise<ReportStatusResult> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status !== "Completed") {
    return {
      status: "NotRequired",
      message: "Interview is not completed yet.",
    };
  }

  const questionLimit = getInterviewQuestionLimit(
    interview.difficulty as "Easy" | "Medium" | "Hard"
  );
  const minimumRequiredAnswers = Math.ceil(questionLimit * 0.5);

  const turns = await LiveInterviewTurn.find({
    interviewId: interview._id,
  }).sort({
    sequence: 1,
  });

  const candidateTurns = turns.filter(isAnsweredCandidateTurn);
  const answeredCount = candidateTurns.length;

  if (answeredCount < minimumRequiredAnswers) {
    return {
      status: "NotRequired",
      answeredCount,
      minimumRequiredAnswers,
      message: "Fewer than 50% of questions were answered.",
    };
  }

  const report = await InterviewReport.findOne({
    interviewId: interview._id,
    userId,
  });

  if (!report) {
    return {
      status: "NotRequired",
      answeredCount,
      minimumRequiredAnswers,
    };
  }

  let mappedStatus: "NotRequired" | "Processing" | "Completed" | "Failed" =
    "Processing";

  if (report.status === "Completed" || report.status === "ready") {
    mappedStatus = "Completed";
  } else if (report.status === "Failed" || report.status === "failed") {
    mappedStatus = "Failed";
  } else if (report.status === "NotRequired") {
    mappedStatus = "NotRequired";
  } else {
    mappedStatus = "Processing";
  }

  return {
    status: mappedStatus,
    reportId: report._id,
    overallScore: mappedStatus === "Completed" ? report.overallScore : null,
    error: mappedStatus === "Failed" ? report.summary : null,
    errorMessage: mappedStatus === "Failed" ? report.errorMessage : null,
    answeredCount,
    minimumRequiredAnswers,
  };
};

export const leaveLiveInterview = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
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
    updatedAt: Date;
  };
}> => {
  const interview = await getInterview({
    interviewId,
    userId,
  });

  if (interview.status !== "Completed") {
    interview.status = "Left";
    await interview.save();

    console.log(
      `[Live Interview] Interview ${interviewId} marked as Left`
    );
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
      updatedAt: interview.updatedAt,
    },
  };
};
