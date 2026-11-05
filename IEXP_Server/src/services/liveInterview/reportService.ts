import mongoose from "mongoose";
import Interview from "../../models/Interview.js";
import LiveInterviewTurn from "../../models/LiveInterviewTurn.js";
import InterviewReport from "../../models/InterviewReport.js";
import { generateInterviewReportWithOpenRouter } from "../openrouterInterviewReportService.js";
import { generateInterviewReportWithGemini } from "../geminiInterviewReportService.js";
import { getInterviewQuestionLimit } from "../../utils/interviewConfig.js";
import {
  SessionConflictError,
  SESSION_HEARTBEAT_TIMEOUT_MS,
  CompleteLiveInterviewResult,
  ReportStatusResult,
} from "./types.js";
import { validateObjectId, getInterview } from "./sessionManagement.js";
import { isAnsweredCandidateTurn } from "./turnsService.js";

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

    let generatedReport: any;
    try {
      generatedReport = await generateInterviewReportWithOpenRouter({
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        conversation,
      });
    } catch (openRouterErr: any) {
      console.warn(
        `[Report Worker] OpenRouter report generation failed for ${interviewId} (${openRouterErr?.message || openRouterErr}). Falling back to Gemini...`
      );
      generatedReport = await generateInterviewReportWithGemini({
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        conversation,
      });
    }

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
  sessionId,
  elapsedSeconds,
}: {
  interviewId: string;
  userId: string;
  sessionId?: string;
  elapsedSeconds?: number;
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

  // Active session conflict verification on completion
  const now = new Date();
  const isExpired =
    !interview.activeSessionLastHeartbeat ||
    now.getTime() - new Date(interview.activeSessionLastHeartbeat).getTime() >
      SESSION_HEARTBEAT_TIMEOUT_MS;

  if (interview.status === "In Progress" && interview.activeSessionId && !isExpired) {
    if (!sessionId || interview.activeSessionId !== sessionId) {
      throw new SessionConflictError(
        "Cannot complete interview: active session is currently running on another device."
      );
    }
  }

  if (typeof elapsedSeconds === "number" && Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0) {
    const wholeSeconds = Math.floor(elapsedSeconds);
    interview.activeDurationSeconds = Math.max(interview.activeDurationSeconds || 0, wholeSeconds);
  }

  // Mark interview completed in database if not already completed and clear active session
  if (interview.status !== "Completed") {
    interview.status = "Completed";
    interview.endedAt = new Date();
    interview.activeSessionId = null;
    interview.activeSessionLastHeartbeat = null;
    await interview.save();
  } else if (typeof elapsedSeconds === "number" && Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0) {
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
