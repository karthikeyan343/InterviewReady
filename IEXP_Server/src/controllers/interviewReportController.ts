import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../middleware/authMiddleware.js";

import Interview from "../models/Interview.js";
import InterviewReport from "../models/InterviewReport.js";
import {
  getInterviewReportStatus,
  retryInterviewReportGeneration,
} from "../services/liveInterviewService.js";

export const getInterviewReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid interview ID",
      });
      return;
    }

    const interviewObjectId = new mongoose.Types.ObjectId(id);

    const interview = await Interview.findOne({
      _id: interviewObjectId,
      userId: req.userId,
    });

    if (!interview) {
      res.status(404).json({
        message: "Interview not found",
      });
      return;
    }

    const report = await InterviewReport.findOne({
      interviewId: interviewObjectId,
      userId: req.userId,
    });

    if (!report) {
      res.status(404).json({
        message: "Interview report not found or not required",
        status: "NotRequired",
      });
      return;
    }

    let normalizedStatus: "Processing" | "Completed" | "Failed" | "NotRequired" =
      "Processing";

    if (report.status === "ready" || report.status === "Completed") {
      normalizedStatus = "Completed";
    } else if (report.status === "failed" || report.status === "Failed") {
      normalizedStatus = "Failed";
    } else if (report.status === "NotRequired") {
      normalizedStatus = "NotRequired";
    } else {
      normalizedStatus = "Processing";
    }

    res.status(200).json({
      message: "Interview report fetched successfully",
      status: normalizedStatus,
      report: {
        id: report._id,
        interviewId: report.interviewId,
        overallScore: report.overallScore,
        technicalScore: report.technicalScore,
        communicationScore: report.communicationScore,
        problemSolvingScore: report.problemSolvingScore,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        suggestions: report.suggestions,
        summary: report.summary,
        status: normalizedStatus,
        errorMessage: report.errorMessage || null,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get interview report error:", error);
    res.status(500).json({
      message: "Server error while fetching interview report",
    });
  }
};

export const getInterviewReportStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const rawId = req.params.id;
    const interviewId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      res.status(400).json({
        message: "Invalid interview ID",
      });
      return;
    }

    const result = await getInterviewReportStatus({
      interviewId,
      userId: req.userId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get interview report status error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch report status.";
    res.status(500).json({
      message,
    });
  }
};

export const retryInterviewReportGenerationController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const rawId = req.params.id;
    const interviewId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      res.status(400).json({
        message: "Invalid interview ID",
      });
      return;
    }

    const result = await retryInterviewReportGeneration({
      interviewId,
      userId: req.userId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Retry interview report error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to retry report generation.";
    res.status(400).json({
      message,
    });
  }
};
