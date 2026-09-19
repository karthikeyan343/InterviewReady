import { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../middleware/authMiddleware.js";

import Interview from "../models/Interview.js";
import InterviewReport from "../models/InterviewReport.js";

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

    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        message: "Interview ID is required",
      });

      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid interview ID",
      });

      return;
    }

    const interviewObjectId =
      new mongoose.Types.ObjectId(id);

    const interview =
      await Interview.findOne({
        _id: interviewObjectId,
        userId: req.userId,
      });

    if (!interview) {
      res.status(404).json({
        message: "Interview not found",
      });

      return;
    }

    const report =
      await InterviewReport.findOne({
        interviewId:
          interviewObjectId,

        userId:
          req.userId,
      });

    if (!report) {
      res.status(404).json({
        message:
          "Interview report not found",
      });

      return;
    }

    res.status(200).json({
      message:
        "Interview report fetched successfully",

      report: {
        id:
          report._id,

        interviewId:
          report.interviewId,

        overallScore:
          report.overallScore,

        technicalScore:
          report.technicalScore,

        communicationScore:
          report.communicationScore,

        problemSolvingScore:
          report.problemSolvingScore,

        strengths:
          report.strengths,

        weaknesses:
          report.weaknesses,

        suggestions:
          report.suggestions,

        summary:
          report.summary,

        status:
          report.status || "ready",

        createdAt:
          report.createdAt,

        updatedAt:
          report.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get interview report error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching interview report",
    });
  }
};
