import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import Interview from "../models/Interview.js";
import Resume from "../models/Resume.js";
import InterviewReport from "../models/InterviewReport.js";
import LiveInterviewTurn from "../models/LiveInterviewTurn.js";

export const createInterview = async (
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

    const { role, interviewType, difficulty } = req.body;

    if (!role || !interviewType || !difficulty) {
      res.status(400).json({
        message: "Role, interview type and difficulty are required",
      });
      return;
    }

    const cleanedRole = String(role).trim();

    if (!cleanedRole) {
      res.status(400).json({
        message: "Role cannot be empty",
      });
      return;
    }

    const allowedInterviewTypes = [
      "Technical",
      "Behavioral",
      "Mixed",
    ];

    if (!allowedInterviewTypes.includes(interviewType)) {
      res.status(400).json({
        message:
          "Interview type must be Technical, Behavioral or Mixed",
      });
      return;
    }

    const allowedDifficulties = [
      "Easy",
      "Medium",
      "Hard",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
      res.status(400).json({
        message:
          "Difficulty must be Easy, Medium or Hard",
      });
      return;
    }

    const resume = await Resume.findOne({
      userId: req.userId,
    });

    if (!resume) {
      res.status(404).json({
        message:
          "Resume not found. Please upload your resume before starting an interview.",
      });
      return;
    }

    const interview = await Interview.create({
      userId: req.userId,
      resumeId: resume._id,
      role: cleanedRole,
      interviewType,
      difficulty,
      status: "Not Started",
    });

    res.status(201).json({
      message: "Interview created successfully",
      interview: {
        id: interview._id,
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        status: interview.status,
        resumeId: interview.resumeId,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error("Create interview error:", error);

    res.status(500).json({
      message: "Server error while creating interview",
    });
  }
};

export const getDashboardData = async (
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

    const interviews = await Interview.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    const reports = await InterviewReport.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    const reportMap = new Map(
      reports.map((report) => [
        report.interviewId.toString(),
        report,
      ])
    );

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (interview) => interview.status === "Completed"
    ).length;

    const readyReports = reports.filter(
      (r) => r.status === "ready" || r.status === "Completed"
    );

    const averageScore =
      readyReports.length > 0
        ? Math.round(
            readyReports.reduce(
              (total, report) =>
                total + report.overallScore,
              0
            ) / readyReports.length
          )
        : 0;

    const technicalScore =
      readyReports.length > 0
        ? Math.round(
            readyReports.reduce(
              (total, report) =>
                total + report.technicalScore,
              0
            ) / readyReports.length
          )
        : 0;

    const communicationScore =
      readyReports.length > 0
        ? Math.round(
            readyReports.reduce(
              (total, report) =>
                total + report.communicationScore,
              0
            ) / readyReports.length
          )
        : 0;

    const problemSolvingScore =
      readyReports.length > 0
        ? Math.round(
            readyReports.reduce(
              (total, report) =>
                total + report.problemSolvingScore,
              0
            ) / readyReports.length
          )
        : 0;

    const recentInterviews = interviews
      .slice(0, 5)
      .map((interview) => {
        const report = reportMap.get(
          interview._id.toString()
        );

        let reportStatus: "Processing" | "Completed" | "Failed" | "NotRequired" | "none" =
          "none";

        if (report) {
          if (report.status === "ready" || report.status === "Completed") {
            reportStatus = "Completed";
          } else if (report.status === "failed" || report.status === "Failed") {
            reportStatus = "Failed";
          } else if (report.status === "NotRequired") {
            reportStatus = "NotRequired";
          } else {
            reportStatus = "Processing";
          }
        } else if (interview.status === "Completed") {
          reportStatus = "NotRequired";
        }

        const isReady =
          report && (report.status === "ready" || report.status === "Completed");

        return {
          id: interview._id,
          role: interview.role,
          interviewType: interview.interviewType,
          difficulty: interview.difficulty,
          status: interview.status,
          createdAt: interview.createdAt,
          startedAt: interview.startedAt,
          endedAt: interview.endedAt,
          reportStatus,
          score: isReady ? report.overallScore : null,
        };
      });

    let continuePractice =
      interviews.find(
        (interview) => interview.status === "In Progress"
      ) || null;

    if (!continuePractice) {
      continuePractice =
        interviews.find(
          (interview) => interview.status === "Not Started"
        ) || null;
    }

    const continuePracticeData = continuePractice
      ? {
          id: continuePractice._id,
          role: continuePractice.role,
          interviewType:
            continuePractice.interviewType,
          difficulty: continuePractice.difficulty,
          status: continuePractice.status,
          createdAt: continuePractice.createdAt,
        }
      : null;

    const resume = await Resume.findOne({
      userId: req.userId,
    });

    res.status(200).json({
      stats: {
        totalInterviews,
        completedInterviews,
        averageScore,
      },

      readiness: {
        overall: averageScore,
        technical: technicalScore,
        communication: communicationScore,
        problemSolving: problemSolvingScore,
      },

      recentInterviews,

      continuePractice: continuePracticeData,

      resume: resume
        ? {
            uploaded: true,
            id: resume._id,
            originalFileName:
              resume.originalFileName,
            fileType: resume.fileType,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
          }
        : {
            uploaded: false,
          },
    });
  } catch (error) {
    console.error(
      "Get dashboard data error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching dashboard data",
    });
  }
};

export const getAllInterviews = async (
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

    const interviews = await Interview.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    const interviewIds = interviews.map(
      (interview) => interview._id
    );

    const reports = await InterviewReport.find({
      userId: req.userId,
      interviewId: {
        $in: interviewIds,
      },
    });

    const reportMap = new Map(
      reports.map((report) => [
        report.interviewId.toString(),
        report,
      ])
    );

    const turns = await LiveInterviewTurn.find({
      interviewId: {
        $in: interviewIds,
      },
    }).sort({
      sequence: 1,
    });

    const turnsMap = new Map<string, typeof turns>();

    for (const turn of turns) {
      const key = turn.interviewId.toString();

      const existingTurns =
        turnsMap.get(key) || [];

      existingTurns.push(turn);
      turnsMap.set(key, existingTurns);
    }

    const result = interviews.map((interview) => {
      const interviewId =
        interview._id.toString();

      const report = reportMap.get(interviewId);

      const interviewTurns =
        turnsMap.get(interviewId) || [];

      const questionCount =
        interviewTurns.filter(
          (turn) =>
            turn.speaker === "interviewer" &&
            turn.isQuestion === true
        ).length;

      let durationMinutes:
        | number
        | null = null;

      if (
        interview.startedAt &&
        interview.endedAt
      ) {
        durationMinutes = Math.max(
          1,
          Math.round(
            (
              interview.endedAt.getTime() -
              interview.startedAt.getTime()
            ) / 60000
          )
        );
      }

      let reportStatus: "Processing" | "Completed" | "Failed" | "NotRequired" | "none" =
        "none";

      if (report) {
        if (report.status === "ready" || report.status === "Completed") {
          reportStatus = "Completed";
        } else if (report.status === "failed" || report.status === "Failed") {
          reportStatus = "Failed";
        } else if (report.status === "NotRequired") {
          reportStatus = "NotRequired";
        } else {
          reportStatus = "Processing";
        }
      } else if (interview.status === "Completed") {
        reportStatus = "NotRequired";
      }

      const isReady =
        report && (report.status === "ready" || report.status === "Completed");

      return {
        id: interview._id,
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        status: interview.status,
        createdAt: interview.createdAt,
        startedAt: interview.startedAt,
        endedAt: interview.endedAt,
        questionCount,
        durationMinutes,
        reportStatus,
        score: isReady ? report.overallScore : null,
        report: report
          ? {
              id: report._id,
              status: reportStatus,
              overallScore: report.overallScore,
              technicalScore: report.technicalScore,
              communicationScore: report.communicationScore,
              problemSolvingScore: report.problemSolvingScore,
            }
          : null,
      };
    });

    res.status(200).json({
      interviews: result,
    });
  } catch (error) {
    console.error(
      "Get all interviews error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching interviews",
    });
  }
};
