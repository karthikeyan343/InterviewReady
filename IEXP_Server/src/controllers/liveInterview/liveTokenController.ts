import { Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import mongoose from "mongoose";

import Interview from "../../models/Interview.js";
import Resume from "../../models/Resume.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { extractCompactResumeContext } from "../../utils/resumeContextExtractor.js";
import { SESSION_HEARTBEAT_TIMEOUT_MS } from "../../services/liveInterviewService.js";
import { getInterviewQuestionLimit } from "../../utils/interviewConfig.js";
import {
  buildInterviewTypeInstructions,
  buildLiveSystemInstruction,
} from "./livePromptBuilder.js";

const MODEL_NAME = "gemini-3.1-flash-live-preview";

export const createLiveInterviewToken = async (
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

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.userId,
    });

    if (!interview) {
      res.status(404).json({
        message: "Interview not found.",
      });
      return;
    }

    if (
      interview.status !== "Not Started" &&
      interview.status !== "In Progress" &&
      interview.status !== "Left"
    ) {
      res.status(400).json({
        message: `Interview cannot start from ${interview.status} status.`,
      });
      return;
    }

    const rawSessionId = req.headers["x-session-id"] || req.body?.sessionId;
    const sessionId = typeof rawSessionId === "string" ? rawSessionId : undefined;
    const now = new Date();
    const isExpired =
      !interview.activeSessionLastHeartbeat ||
      now.getTime() - new Date(interview.activeSessionLastHeartbeat).getTime() >
        SESSION_HEARTBEAT_TIMEOUT_MS;

    if (interview.activeSessionId && !isExpired) {
      if (!sessionId || interview.activeSessionId !== sessionId) {
        res.status(409).json({
          message:
            "This interview session is currently active on another device or tab. Simultaneous access is prevented to protect interview state.",
          code: "SESSION_CONFLICT",
        });
        return;
      }
    } else if (sessionId) {
      interview.activeSessionId = sessionId;
      interview.activeSessionLastHeartbeat = now;
      await interview.save();
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      res.status(500).json({
        message: "Gemini API key is not configured.",
      });
      return;
    }

    const questionLimit = getInterviewQuestionLimit(
      interview.difficulty as "Easy" | "Medium" | "Hard"
    );

    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
    });

    let compactResumeContext = "";

    if (interview.resumeId) {
      try {
        const resume = await Resume.findOne({
          _id: interview.resumeId,
          userId: req.userId,
        }).select("extractedText");

        if (resume && resume.extractedText) {
          compactResumeContext = extractCompactResumeContext(resume.extractedText);
        }
      } catch (resumeError) {
        console.warn(
          "[Live Interview] Failed to retrieve resume context for token creation:",
          resumeError
        );
      }
    }

    const interviewTypeInstructions = buildInterviewTypeInstructions(
      interview,
      questionLimit
    );

    const systemInstruction = buildLiveSystemInstruction({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questionLimit,
      interviewTypeInstructions,
      compactResumeContext,
    });

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        liveConnectConstraints: {
          model: MODEL_NAME,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: {
              parts: [
                {
                  text: systemInstruction,
                },
              ],
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        },
      },
    });

    res.status(200).json({
      token: token.name,
      model: MODEL_NAME,
      interview: {
        id: interview._id,
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        questionLimit,
      },
    });
  } catch (error) {
    console.error("Create live interview token error:", error);

    res.status(500).json({
      message: "Failed to create Gemini Live session token.",
    });
  }
};

