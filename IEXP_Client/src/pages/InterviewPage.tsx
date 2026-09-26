import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

import { useNavigate, useParams } from "react-router-dom";

import GeminiLiveService from "../services/geminiLiveService";
import InteractiveAvatar from "../component/specifiedComponent/InteractiveAvatar";
import InterviewReadyScreen from "./InterviewReadyScreen";
import { invalidateDashboard, invalidateInterviews } from "../services/apiQueries";

const InterviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveServiceRef = useRef<GeminiLiveService | null>(null);

  const geminiSpeakingRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState("");

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [aiStatus, setAiStatus] = useState<
    "Listening" | "Thinking" | "Speaking"
  >("Listening");

  const [geminiAudioLevel, setGeminiAudioLevel] = useState(0);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const totalQuestionsRef = useRef(20);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [interviewerTranscript, setInterviewerTranscript] = useState(
    "Your AI interviewer is preparing the first question.",
  );

  const [candidateTranscript, setCandidateTranscript] = useState(
    "Your speech will appear here as text while you speak.",
  );

  const [isSavingTurn, setIsSavingTurn] = useState(false);
  const [isCompletingInterview, setIsCompletingInterview] = useState(false);

  const turnSaveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const lastSavedCandidateTextRef = useRef("");
  const lastSavedInterviewerTextRef = useRef("");

  const candidateAnswerCountRef = useRef(0);
  const interviewCompletedRef = useRef(false);
  const geminiSystemInstructionSentRef = useRef(false);

  const interviewerQuestionCountRef = useRef(0);
  const pendingCompletionRef = useRef(false);
  const continuationRequestedRef = useRef(false);
  const waitingForClosingStatementRef = useRef(false);
  const isCandidateSpeakingTurnRef = useRef(false);

  const [error, setError] = useState("");
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectNotice, setReconnectNotice] = useState("");

  const [idleProcessingNotice, setIdleProcessingNotice] = useState("");
  const [showHighDemandModal, setShowHighDemandModal] = useState(false);
  const [showEndEarlyModal, setShowEndEarlyModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 15-second candidate no-answer countdown
  const [candidateCountdown, setCandidateCountdown] = useState<number | null>(null);
  const candidateNoAnswerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const candidateCountdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingSkipRef = useRef(false);

  const isLeavingRef = useRef(false);
  const isReconnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  // Single authoritative Gemini idle watchdog
  const geminiIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geminiRecoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geminiMeaningfulProgressRef = useRef(false);

  // Before unload warning while interview is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (started && !interviewCompletedRef.current && !isLeavingRef.current) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started]);

  // Overall component teardown
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (candidateNoAnswerTimeoutRef.current) {
        clearTimeout(candidateNoAnswerTimeoutRef.current);
        candidateNoAnswerTimeoutRef.current = null;
      }

      if (candidateCountdownIntervalRef.current) {
        clearInterval(candidateCountdownIntervalRef.current);
        candidateCountdownIntervalRef.current = null;
      }

      if (geminiIdleTimerRef.current) {
        clearTimeout(geminiIdleTimerRef.current);
        geminiIdleTimerRef.current = null;
      }

      if (geminiRecoveryTimerRef.current) {
        clearTimeout(geminiRecoveryTimerRef.current);
        geminiRecoveryTimerRef.current = null;
      }

      liveServiceRef.current?.disconnect();
      liveServiceRef.current = null;

      geminiSpeakingRef.current = false;

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    };
  }, []);

  // Video element preview binding and recovery on camera toggle / stream / viewport change
  useEffect(() => {
    const videoEl = videoRef.current;
    const stream = streamRef.current;

    if (videoEl && stream && cameraEnabled && mediaReady) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      videoEl.play().catch((error) => {
        console.warn("Video playback was prevented:", error);
      });
    }
  }, [started, mediaReady, cameraEnabled, isMobile]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const setupMedia = async () => {
    try {
      setMediaError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setMediaError(
          "Camera and microphone are not supported by this browser.",
        );
        return false;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      setMediaReady(true);
      setMicEnabled(true);
      setCameraEnabled(true);

      return true;
    } catch (error) {
      console.error("Media permission error:", error);
      setMediaError(
        "Camera and microphone permission is required to start the interview.",
      );
      return false;
    }
  };

  const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const saveConversationTurn = (
    speaker: "interviewer" | "candidate",
    text: string,
    isQuestion = false,
  ): Promise<void> => {
    const cleanedText = text.trim();

    if (!id || !cleanedText) {
      return Promise.resolve();
    }

    const task = async () => {
      setIsSavingTurn(true);

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/interviews/${id}/live/turn`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              speaker,
              text: cleanedText,
              isQuestion,
              timestamp: new Date().toISOString(),
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to save interview conversation.",
          );
        }

        console.log(`[Live Interview] Saved ${speaker} turn:`, data);
      } finally {
        setIsSavingTurn(false);
      }
    };

    turnSaveQueueRef.current = turnSaveQueueRef.current
      .catch(() => undefined)
      .then(task);

    return turnSaveQueueRef.current;
  };

  const clearCandidateNoAnswerTimeout = () => {
    if (candidateNoAnswerTimeoutRef.current) {
      clearTimeout(candidateNoAnswerTimeoutRef.current);
      candidateNoAnswerTimeoutRef.current = null;
    }
    if (candidateCountdownIntervalRef.current) {
      clearInterval(candidateCountdownIntervalRef.current);
      candidateCountdownIntervalRef.current = null;
    }
    setCandidateCountdown(null);
  };

  const startCandidateNoAnswerTimeout = () => {
    clearCandidateNoAnswerTimeout();
    if (
      interviewCompletedRef.current ||
      waitingForClosingStatementRef.current ||
      geminiSpeakingRef.current ||
      !started
    ) {
      return;
    }

    isProcessingSkipRef.current = false;
    setCandidateCountdown(15);
    let remaining = 15;

    candidateCountdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) {
        setCandidateCountdown(remaining);
      } else {
        if (candidateCountdownIntervalRef.current) {
          clearInterval(candidateCountdownIntervalRef.current);
          candidateCountdownIntervalRef.current = null;
        }
      }
    }, 1000);

    candidateNoAnswerTimeoutRef.current = setTimeout(() => {
      clearCandidateNoAnswerTimeout();

      if (
        interviewCompletedRef.current ||
        waitingForClosingStatementRef.current ||
        geminiSpeakingRef.current ||
        isProcessingSkipRef.current ||
        isCandidateSpeakingTurnRef.current
      ) {
        return;
      }

      isProcessingSkipRef.current = true;
      console.warn(
        `[Live Interview] Candidate no-answer 15s timeout reached for Question ${interviewerQuestionCountRef.current}. Marking question skipped.`,
      );

      setCandidateTranscript(
        "Question skipped (no response received within 15 seconds).",
      );

      void saveConversationTurn("candidate", "[Skipped / No Answer]", false).catch(
        (err) => {
          console.warn("Error saving skipped turn:", err);
        },
      );

      const target = totalQuestionsRef.current || 20;
      const currentQ = interviewerQuestionCountRef.current;

      if (currentQ >= target) {
        console.log(
          "[Live Interview] Target questions reached after skip. Requesting closing statement.",
        );
        waitingForClosingStatementRef.current = true;
        liveServiceRef.current?.sendText(
          `The question was skipped due to timeout. The required limit of ${target} questions has been reached. Do NOT ask any more questions. Give a short closing statement concluding the interview: "Thank you for attending the interview. That concludes the interview." and stop speaking.`,
        );
      } else {
        liveServiceRef.current?.sendText(
          "The candidate did not provide an answer within 15 seconds. The question was skipped. Please ask the next question now.",
        );
      }

      startGeminiIdleWatchdog();
    }, 15000);
  };

  const clearGeminiIdleWatchdog = () => {
    if (geminiIdleTimerRef.current) {
      clearTimeout(geminiIdleTimerRef.current);
      geminiIdleTimerRef.current = null;
    }
    if (geminiRecoveryTimerRef.current) {
      clearTimeout(geminiRecoveryTimerRef.current);
      geminiRecoveryTimerRef.current = null;
    }
    setIdleProcessingNotice("");
  };

  const startGeminiIdleWatchdog = () => {
    clearGeminiIdleWatchdog();
    if (interviewCompletedRef.current) return;

    geminiMeaningfulProgressRef.current = false;

    geminiIdleTimerRef.current = setTimeout(() => {
      geminiIdleTimerRef.current = null;

      if (
        !interviewCompletedRef.current &&
        !geminiSpeakingRef.current &&
        !geminiMeaningfulProgressRef.current &&
        started
      ) {
        console.warn(
          "[Live Interview] 20s Gemini idle watchdog fired without response. Performing recovery...",
        );
        setIdleProcessingNotice(
          "Your response was received. We're processing the next question...",
        );

        const target = totalQuestionsRef.current || 20;
        const isClosing =
          waitingForClosingStatementRef.current ||
          candidateAnswerCountRef.current >= target;

        if (liveServiceRef.current?.isConnected()) {
          if (isClosing) {
            console.log(
              "[Live Interview] Recovery: Nudging Gemini for final closing statement...",
            );
            liveServiceRef.current.sendText(
              "The candidate has completed the final question. Please provide a brief closing statement concluding the interview: 'Thank you for attending the interview. That concludes the interview.' and stop speaking.",
            );
          } else {
            const lastCandidateAns = lastSavedCandidateTextRef.current;
            console.log(
              "[Live Interview] Recovery: Prompting Gemini to progress with next question...",
            );
            if (lastCandidateAns && !lastCandidateAns.startsWith("[Skipped")) {
              liveServiceRef.current.sendText(
                `The candidate completed their answer: "${lastCandidateAns}". Please ask the next question now.`,
              );
            } else {
              liveServiceRef.current.sendText(
                "The candidate has completed their response. Please ask the next question now.",
              );
            }
          }
        } else {
          console.warn(
            "[Live Interview] Recovery: Connection dropped. Reconnecting...",
          );
          void handleReconnect();
        }

        // 10-second recovery window (total ~30s)
        geminiRecoveryTimerRef.current = setTimeout(() => {
          geminiRecoveryTimerRef.current = null;

          if (
            !interviewCompletedRef.current &&
            !geminiSpeakingRef.current &&
            !geminiMeaningfulProgressRef.current &&
            started
          ) {
            console.warn(
              "[Live Interview] Recovery window (~30s total) expired without response. Displaying high demand notification.",
            );
            setIdleProcessingNotice("");
            setShowHighDemandModal(true);
          }
        }, 10000);
      }
    }, 20000);
  };

  const completeInterview = () => {
    if (!id || interviewCompletedRef.current) {
      return;
    }

    interviewCompletedRef.current = true;
    pendingCompletionRef.current = false;
    clearCandidateNoAnswerTimeout();
    clearGeminiIdleWatchdog();

    setIsCompletingInterview(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    liveServiceRef.current?.disconnect();
    liveServiceRef.current = null;

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;

    // Trigger backend completion asynchronously without blocking the user
    const triggerBackendCompletion = async () => {
      try {
        await turnSaveQueueRef.current;

        const response = await fetch(
          `${getApiBaseUrl()}/interviews/${id}/live/complete`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({}),
          },
        );

        const data = await response.json();
        console.log("[Live Interview] Final complete response:", data);
      } catch (error) {
        console.warn("[Live Interview] Error during complete call:", error);
      } finally {
        // Invalidate interview list and dashboard caches
        invalidateInterviews();
        invalidateDashboard();
      }
    };

    void triggerBackendCompletion();

    // Immediately finish interview UI flow and navigate to dashboard
    navigate("/dashboard");
  };

  const handleLeaveInterview = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    isLeavingRef.current = true;

    clearCandidateNoAnswerTimeout();
    clearGeminiIdleWatchdog();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    liveServiceRef.current?.disconnect();
    liveServiceRef.current = null;

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;

    const triggerBackendLeave = async () => {
      try {
        await turnSaveQueueRef.current;
        await fetch(
          `${getApiBaseUrl()}/interviews/${id}/live/leave`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          },
        );
      } catch (err) {
        console.warn("[Live Interview] Error during leave call:", err);
      } finally {
        invalidateInterviews();
        invalidateDashboard();
      }
    };

    void triggerBackendLeave();

    navigate("/dashboard");
  };

  const handleReconnect = async () => {
    if (isReconnectingRef.current || interviewCompletedRef.current || !id) {
      return;
    }

    isReconnectingRef.current = true;
    setReconnecting(true);
    setReconnectNotice(
      "Gemini is experiencing high demand. Please wait while we reconnect/resume your interview.",
    );

    const maxAttempts = 4;
    const delays = [1500, 3000, 5000, 8000];

    while (
      reconnectAttemptsRef.current < maxAttempts &&
      !interviewCompletedRef.current
    ) {
      const delay = delays[reconnectAttemptsRef.current] || 5000;
      reconnectAttemptsRef.current += 1;

      console.log(
        `[Live Interview] Reconnecting (attempt ${reconnectAttemptsRef.current}/${maxAttempts}) in ${delay}ms...`,
      );
      await new Promise((res) => setTimeout(res, delay));

      try {
        if (!streamRef.current) {
          await setupMedia();
        }

        if (!liveServiceRef.current) {
          liveServiceRef.current = new GeminiLiveService();
        }

        const handlers = createLiveHandlers(true, totalQuestionsRef.current);
        await liveServiceRef.current.reconnect(id, handlers);

        console.log("[Live Interview] Reconnection successful!");
        setReconnecting(false);
        setReconnectNotice("");
        isReconnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        return;
      } catch (err) {
        console.warn("[Live Interview] Reconnect attempt failed:", err);
      }
    }

    isReconnectingRef.current = false;
    setReconnecting(false);
    setError(
      "Connection to AI interviewer lost. Please click Join Interview to resume.",
    );
  };

  const createLiveHandlers = (
    isResume = false,
    targetLimitOverride?: number,
    _resumeSessionData?: any,
  ) => ({
    onOpen: async () => {
      const stream = streamRef.current;
      if (!stream) {
        throw new Error("Microphone stream is not available.");
      }

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error("Microphone audio track is not available.");
      }

      setAiStatus("Thinking");
      await liveServiceRef.current?.startMicrophone(stream);
      liveServiceRef.current?.setSpeakerEnabled(speakerEnabled);

      if (!micEnabled) {
        liveServiceRef.current?.pauseMicrophone();
      }

      const target =
        targetLimitOverride || totalQuestionsRef.current || 20;
      const currentQ = interviewerQuestionCountRef.current;
      const answeredQ = candidateAnswerCountRef.current;

      if (isResume || currentQ > 0) {
        const lastQ = interviewerTranscript || "";
        liveServiceRef.current?.sendText(
          `Resume the ongoing interview now.

Role: Interview Candidate
Difficulty: Authoritative
Target total questions: EXACTLY ${target} questions.

STATUS:
- Questions already asked: ${currentQ}
- Candidate answers received: ${answeredQ}
${lastQ ? `- Most recent question: "${lastQ}"` : ""}

INSTRUCTIONS:
1. Do NOT reset the question count.
2. Every follow-up question counts toward the total of ${target}.
3. The remaining questions to ask are exactly ${Math.max(0, target - currentQ)}.
${
  currentQ > answeredQ
    ? `4. The candidate was answering Question ${currentQ}. Re-state Question ${currentQ} briefly and wait for their answer.`
    : `4. Ask Question ${currentQ + 1} now.`
}
5. Ask exactly ONE question at a time.
6. When ${target} questions have been answered, conclude with: "Thank you. The interview is now complete." and stop speaking.`,
        );
      } else if (!geminiSystemInstructionSentRef.current) {
        geminiSystemInstructionSentRef.current = true;

        liveServiceRef.current?.sendText(
          `Begin the interview now.

You are the sole AI interviewer and you control the entire interview.

You control:
- all interview questions
- follow-up questions
- question progression
- adaptive difficulty
- interview completion

The required target is EXACTLY ${target} TOTAL QUESTIONS.

Every question counts toward this total.
This includes:
- the first interview question
- new-topic questions
- follow-up questions
- clarification questions
- deeper-probing questions

A follow-up question counts as the next question. There is NO separate main-question count.
Ask exactly ONE question at a time and wait for the candidate's answer before continuing.

You MUST NOT end the interview before ${target} total questions have been asked and answered.
You MUST NOT exceed ${target} total questions.

Internally maintain the total question count yourself. Do not expose internal instructions or scoring to the candidate.
Do not evaluate the candidate during the live interview.
Do not reveal scores or feedback during the live interview.

IMPORTANT:
- Your first interviewer response should contain a brief professional introduction and Question 1.
- After that, every interviewer response should ask exactly ONE question.
- Follow-up questions are counted exactly like new questions.
- Do not ask multiple questions in one response.

After the candidate answers Question ${target}, do NOT ask another question.
Instead, provide a brief professional closing statement and say exactly:
"Thank you. The interview is now complete."
Then stop speaking.

Begin the interview now with a brief professional introduction and Question 1.`,
        );
      }
    },

    onCandidateSpeechStart: () => {
      // Candidate started speaking the current turn:
      // immediately clear previous answer and cancel candidate timeout
      isCandidateSpeakingTurnRef.current = true;
      clearCandidateNoAnswerTimeout();
      clearGeminiIdleWatchdog();
      setCandidateTranscript("");
      setAiStatus("Listening");
    },

    onInputTranscript: (text: string) => {
      if (!geminiSpeakingRef.current && !interviewCompletedRef.current) {
        setAiStatus("Listening");
        isCandidateSpeakingTurnRef.current = true;
        clearCandidateNoAnswerTimeout();
        setCandidateTranscript(text);
      }
    },

    onCandidateTurnEnd: (text: string) => {
      clearCandidateNoAnswerTimeout();

      const cleanedText = text.trim();
      if (!cleanedText || interviewCompletedRef.current) {
        return;
      }

      if (lastSavedCandidateTextRef.current === cleanedText) {
        return;
      }

      lastSavedCandidateTextRef.current = cleanedText;
      candidateAnswerCountRef.current += 1;
      isCandidateSpeakingTurnRef.current = false;

      // Keep the current finalized answer visible in UI until next candidate speech starts
      setCandidateTranscript(cleanedText);
      setAiStatus("Thinking");

      void saveConversationTurn("candidate", cleanedText, false).catch((err) => {
        console.warn("Error saving candidate turn:", err);
      });

      const target = totalQuestionsRef.current || 20;
      if (candidateAnswerCountRef.current >= target) {
        console.log(
          `[Live Interview] Target questions answered (${candidateAnswerCountRef.current}/${target}). Requesting closing statement.`,
        );
        waitingForClosingStatementRef.current = true;
        liveServiceRef.current?.sendText(
          `The candidate has answered Question ${target}, which is the final question of the interview. Do NOT ask another question. Give a short, warm, professional closing statement concluding the interview: "Thank you for attending the interview. That concludes the interview." Then stop speaking.`,
        );
      }

      startGeminiIdleWatchdog();
    },

    onOutputTranscript: (text: string) => {
      const cleanedText = text.trim();
      if (cleanedText) {
        setInterviewerTranscript(cleanedText);
      }

      liveServiceRef.current?.setSpeakerEnabled(speakerEnabled);

      if (!geminiSpeakingRef.current) {
        setAiStatus("Thinking");
      }
    },

    onSpeakingStart: () => {
      geminiSpeakingRef.current = true;
      geminiMeaningfulProgressRef.current = true;
      clearCandidateNoAnswerTimeout();
      clearGeminiIdleWatchdog();
      setInterviewerTranscript("");
      liveServiceRef.current?.pauseMicrophone();
      setAiStatus("Speaking");
      // Candidate's previous answer remains visible until candidate starts speaking again
    },

    onTurnComplete: (completeText: string) => {
      const cleanedText = completeText.trim();
      if (!cleanedText) return;

      geminiMeaningfulProgressRef.current = true;
      setInterviewerTranscript(cleanedText);
      clearGeminiIdleWatchdog();

      if (lastSavedInterviewerTextRef.current === cleanedText) {
        return;
      }
      lastSavedInterviewerTextRef.current = cleanedText;

      const target = totalQuestionsRef.current || 20;
      const lowerText = cleanedText.toLowerCase();
      const isClosingStatement =
        waitingForClosingStatementRef.current ||
        candidateAnswerCountRef.current >= target ||
        lowerText.includes("interview is now complete") ||
        lowerText.includes("concludes the interview") ||
        lowerText.includes("concludes our interview") ||
        lowerText.includes("that concludes") ||
        lowerText.includes("thank you for attending");

      const isQuestion = !isClosingStatement;

      if (isQuestion) {
        interviewerQuestionCountRef.current += 1;
        const questionNumber = interviewerQuestionCountRef.current;
        setCurrentQuestion(questionNumber);

        // Never exceed the target question limit
        if (questionNumber > target) {
          console.warn(
            `[Live Interview] Question count limit reached (${questionNumber} > ${target}). Requesting closing statement.`,
          );
          waitingForClosingStatementRef.current = true;
          liveServiceRef.current?.sendText(
            `You have reached the required limit of ${target} questions. Do NOT ask any more questions. Give a short closing statement: "Thank you for attending the interview. That concludes the interview." and stop speaking.`,
          );
          return;
        }
      }

      void saveConversationTurn(
        "interviewer",
        cleanedText,
        isQuestion,
      ).catch((err) => {
        console.warn("Error saving interviewer turn:", err);
      });

      if (!isClosingStatement) {
        return;
      }

      const observedQuestions = interviewerQuestionCountRef.current;
      if (
        observedQuestions < target &&
        candidateAnswerCountRef.current < target
      ) {
        console.warn(
          `[Live Interview] Gemini attempted to finish early (${observedQuestions}/${target}). Asking it to continue.`,
        );
        continuationRequestedRef.current = true;
        liveServiceRef.current?.sendText(
          `Do not end the interview yet. You have asked only ${observedQuestions} of the required ${target} total questions. Every follow-up question counts toward the same total. Ask Question ${observedQuestions + 1} now.`,
        );
        return;
      }

      // Mark completion as pending until Gemini finishes speaking the closing statement
      pendingCompletionRef.current = true;

      // If Gemini has already stopped speaking audio (e.g. text-only), complete immediately
      if (!geminiSpeakingRef.current && !interviewCompletedRef.current) {
        completeInterview();
      }
    },

    onAudioLevel: (level: number) => {
      setGeminiAudioLevel(level);
    },

    onSpeakingEnd: () => {
      geminiSpeakingRef.current = false;
      setGeminiAudioLevel(0);
      clearGeminiIdleWatchdog();

      if (pendingCompletionRef.current && !interviewCompletedRef.current) {
        console.log(
          "[Live Interview] Gemini closing statement audio playback finished. Completing interview.",
        );
        completeInterview();
        return;
      }

      if (micEnabled) {
        liveServiceRef.current?.resumeMicrophone();
      }

      if (!interviewCompletedRef.current) {
        setAiStatus("Listening");
        // Start 15-second candidate no-answer timeout now that Gemini has finished speaking
        startCandidateNoAnswerTimeout();
      }
    },

    onError: (liveError: any) => {
      console.error("Gemini Live error:", liveError);
      clearCandidateNoAnswerTimeout();
      clearGeminiIdleWatchdog();
      if (started && !interviewCompletedRef.current) {
        void handleReconnect();
      } else {
        setAiStatus("Thinking");
        setError(
          liveError instanceof Error
            ? liveError.message
            : "Unable to connect to the AI interviewer.",
        );
      }
    },

    onClose: () => {
      console.log("Gemini Live WebSocket closed.");
      clearCandidateNoAnswerTimeout();
      clearGeminiIdleWatchdog();
      if (started && !interviewCompletedRef.current && !isLeavingRef.current) {
        void handleReconnect();
      }
    },
  });

  // Check and restore session on page mount / refresh
  useEffect(() => {
    let mounted = true;

    const checkAndResumeSession = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/interviews/${id}/live/session`,
          {
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) return;

        const data = await response.json();
        if (!mounted) return;

        if (data.interview?.status === "Completed") {
          navigate("/dashboard");
          return;
        }

        if (data.interview?.status === "In Progress" || data.interview?.status === "Left") {
          console.log("[Live Interview] Resuming active interview session:", data);
          const limit = data.stats?.totalQuestions ?? 20;
          totalQuestionsRef.current = limit;
          setTotalQuestions(limit);
          setCurrentQuestion(data.stats?.currentQuestion ?? 0);
          candidateAnswerCountRef.current = data.stats?.answeredCount ?? 0;
          interviewerQuestionCountRef.current = data.stats?.currentQuestion ?? 0;

          if (data.lastInterviewerTurn) {
            setInterviewerTranscript(data.lastInterviewerTurn);
          }
          if (data.lastCandidateTurn) {
            setCandidateTranscript(data.lastCandidateTurn);
          }

          if (data.interview?.startedAt) {
            const startedMs = new Date(data.interview.startedAt).getTime();
            const elapsed = Math.max(
              0,
              Math.floor((Date.now() - startedMs) / 1000),
            );
            setElapsedSeconds(elapsed);
          }

          void handleStartInterview(true, data);
        }
      } catch (err) {
        console.warn("[Live Interview] Could not check session state:", err);
      }
    };

    void checkAndResumeSession();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleStartInterview = async (
    isResume = false,
    resumeSessionData?: any,
  ) => {
    if (!id) {
      setError("Interview ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMediaError("");

      interviewCompletedRef.current = false;
      pendingCompletionRef.current = false;
      continuationRequestedRef.current = false;
      waitingForClosingStatementRef.current = false;

      if (!isResume) {
        geminiSystemInstructionSentRef.current = false;
        lastSavedCandidateTextRef.current = "";
        lastSavedInterviewerTextRef.current = "";
        candidateAnswerCountRef.current = 0;
        interviewerQuestionCountRef.current = 0;
        turnSaveQueueRef.current = Promise.resolve();
        setCurrentQuestion(0);
        setElapsedSeconds(0);
        setInterviewerTranscript(
          "Your AI interviewer is preparing the first question.",
        );
        setCandidateTranscript(
          "Your speech will appear here as text while you speak.",
        );
      }

      const mediaStarted = await setupMedia();
      if (!mediaStarted) {
        return;
      }

      let configuredLimit = totalQuestionsRef.current || 20;

      if (!isResume || resumeSessionData?.interview?.status === "Left") {
        const liveStartResponse = await fetch(
          `${getApiBaseUrl()}/interviews/${id}/live/start`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          },
        );

        const liveStartData = await liveStartResponse.json();

        if (!liveStartResponse.ok) {
          throw new Error(
            liveStartData.message || "Failed to start the live interview.",
          );
        }

        configuredLimit = liveStartData.interview?.questionLimit ?? configuredLimit;
        totalQuestionsRef.current = configuredLimit;
        setTotalQuestions(configuredLimit);
      }

      setStarted(true);
      setAiStatus("Thinking");

      if (!isResume) {
        setInterviewerTranscript("Connecting to your AI interviewer...");
      }

      geminiSpeakingRef.current = false;

      const liveService = new GeminiLiveService();
      liveServiceRef.current = liveService;

      const handlers = createLiveHandlers(
        isResume,
        configuredLimit,
        resumeSessionData,
      );
      await liveService.connect(id, handlers);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setElapsedSeconds((previous) => previous + 1);
      }, 1000);
    } catch (error) {
      console.error("Start interview error:", error);

      liveServiceRef.current?.disconnect();
      liveServiceRef.current = null;
      geminiSpeakingRef.current = false;

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setStarted(false);
      setMediaReady(false);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while starting the interview.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMic = () => {
    const stream = streamRef.current;
    if (!stream) {
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      return;
    }

    const nextState = !micEnabled;
    audioTracks.forEach((track) => {
      track.enabled = nextState;
    });
    setMicEnabled(nextState);

    if (!nextState) {
      liveServiceRef.current?.pauseMicrophone();
    } else if (!geminiSpeakingRef.current) {
      liveServiceRef.current?.resumeMicrophone();
    }
  };

  const handleToggleCamera = () => {
    const stream = streamRef.current;
    if (!stream) {
      return;
    }

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      return;
    }

    const nextState = !cameraEnabled;
    videoTracks.forEach((track) => {
      track.enabled = nextState;
    });
    setCameraEnabled(nextState);
  };

  const handleToggleSpeaker = () => {
    const nextState = !speakerEnabled;
    setSpeakerEnabled(nextState);
    liveServiceRef.current?.setSpeakerEnabled(nextState);
  };

  const handleEndInterview = () => {
    if (!started) {
      navigate("/dashboard");
      return;
    }

    const target = totalQuestionsRef.current || 20;
    const threshold = Math.ceil(target * 0.5);
    const answered = candidateAnswerCountRef.current;

    if (answered < threshold) {
      setShowEndEarlyModal(true);
    } else {
      completeInterview();
    }
  };

  const handleConfirmEndAnyway = () => {
    setShowEndEarlyModal(false);
    completeInterview();
  };

  // Pre-interview ready screen extracted cleanly into InterviewReadyScreen
  if (!started) {
    return (
      <InterviewReadyScreen
        id={id}
        loading={loading}
        mediaReady={mediaReady}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        mediaError={mediaError}
        error={error}
        onStart={() => void handleStartInterview(false)}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  // Live Interview Room
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        height: "100dvh",
        backgroundColor: "#111318",
        color: "#ffffff",
        fontFamily:
          '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 20-Second Idle Warning Notification Banner */}
      {idleProcessingNotice && !reconnecting && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: "10px", sm: "16px" },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: {
              xs: "calc(100% - 20px)",
              sm: "auto",
            },
            maxWidth: {
              xs: "calc(100% - 20px)",
              sm: "640px",
            },
            backgroundColor: "#202329",
            border: "1px solid #e69b35",
            borderRadius: "10px",
            px: { xs: "12px", sm: "18px" },
            py: { xs: "9px", sm: "11px" },
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 32px rgba(0,0,0,0.65)",
          }}
        >
          <Box
            sx={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#e69b35",
              flexShrink: 0,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.3 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.3 },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px" },
              lineHeight: 1.4,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {idleProcessingNotice}
          </Typography>
        </Box>
      )}

      {/* High Demand / Reconnecting Notification */}
      {reconnecting && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: "10px", sm: "16px" },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: {
              xs: "calc(100% - 20px)",
              sm: "auto",
            },
            maxWidth: {
              xs: "calc(100% - 20px)",
              sm: "640px",
            },
            backgroundColor: "#202329",
            border: "1px solid #356ae6",
            borderRadius: "10px",
            px: { xs: "12px", sm: "18px" },
            py: { xs: "9px", sm: "11px" },
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 32px rgba(0,0,0,0.65)",
          }}
        >
          <Box
            sx={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#356ae6",
              flexShrink: 0,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.3 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.3 },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px" },
              lineHeight: 1.4,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {reconnectNotice ||
              "Gemini is experiencing high demand. Please wait while we reconnect/resume your interview."}
          </Typography>
        </Box>
      )}

      {/* Top Header */}
      <Box
        sx={{
          height: {
            xs: "48px",
            sm: "56px",
          },
          minHeight: {
            xs: "48px",
            sm: "56px",
          },
          px: {
            xs: "12px",
            sm: "20px",
            md: "24px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #242830",
          backgroundColor: "#17191e",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "8px", sm: "10px" },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: "30px", sm: "34px" },
              height: { xs: "30px", sm: "34px" },
              flexShrink: 0,
              borderRadius: "8px",
              backgroundColor: "#356ae6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SmartToyIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 800,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              AI Interview
            </Typography>

            <Typography
              sx={{
                fontSize: "9px",
                color: "#7f8794",
                whiteSpace: "nowrap",
              }}
            >
              Live session
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: "8px",
              sm: "16px",
            },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <SignalCellularAltIcon
              sx={{
                fontSize: "14px",
                color: "#5ecb8a",
              }}
            />

            <Typography
              sx={{
                fontSize: "10px",
                color: "#9aa1ad",
                fontWeight: 600,
              }}
            >
              Good connection
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              px: { xs: "8px", sm: "10px" },
              py: "4px",
              borderRadius: "6px",
              backgroundColor: "#22252c",
              border: "1px solid #2d313b",
              whiteSpace: "nowrap",
            }}
          >
            <AccessTimeIcon
              sx={{
                fontSize: "12px",
                color: "#9aa1ad",
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 700,
                color: "#ffffff",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(elapsedSeconds)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      {isMobile ? (
        /* MOBILE VIEW: Industry-standard unified video stage with floating PiP + live conversation panel */
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            p: { xs: "8px", sm: "12px" },
            gap: "8px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Mobile Video Stage: AI Avatar + Floating PiP Candidate Video */}
          <Box
            sx={{
              position: "relative",
              height: {
                xs: "clamp(210px, 36dvh, 280px)",
                sm: "clamp(240px, 40dvh, 320px)",
              },
              minHeight: {
                xs: "200px",
                sm: "230px",
              },
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "#171a21",
              border: "1px solid #272b33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* Centered AI Avatar */}
            <InteractiveAvatar
              status={aiStatus}
              audioLevel={geminiAudioLevel}
            />

            {/* AI Status Badge (Top-Left) */}
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                left: "10px",
                px: "8px",
                py: "4px",
                borderRadius: "6px",
                backgroundColor: "rgba(17,19,24,0.85)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                zIndex: 4,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Box
                sx={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor:
                    aiStatus === "Speaking"
                      ? "#5ecb8a"
                      : aiStatus === "Thinking"
                        ? "#356ae6"
                        : "#858b98",
                }}
              />
              <Typography
                sx={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                AI Interviewer • {aiStatus}
              </Typography>
            </Box>

            {/* Question Pill (Top-Right) */}
            {totalQuestions > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  px: "8px",
                  py: "4px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(17,19,24,0.85)",
                  backdropFilter: "blur(6px)",
                  zIndex: 4,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "#ffffff",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Question {Math.min(currentQuestion, totalQuestions)} /{" "}
                  {totalQuestions}
                </Typography>
              </Box>
            )}

            {/* Floating Candidate Self-View (Picture-in-Picture) */}
            <Box
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: { xs: "96px", sm: "115px" },
                height: { xs: "128px", sm: "150px" },
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#1b1e24",
                border: "2px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
                zIndex: 6,
              }}
            >
              <Box
                component="video"
                ref={isMobile ? videoRef : undefined}
                autoPlay
                muted
                playsInline
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  display: cameraEnabled && mediaReady ? "block" : "none",
                }}
              />

              {(!cameraEnabled || !mediaReady) && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1b1e24",
                  }}
                >
                  <Avatar
                    sx={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#2b303a",
                      color: "#9aa1ad",
                      fontSize: "14px",
                      fontWeight: 800,
                    }}
                  >
                    You
                  </Avatar>
                </Box>
              )}

              {/* Candidate "You" Label */}
              <Box
                sx={{
                  position: "absolute",
                  left: "6px",
                  bottom: "6px",
                  px: "6px",
                  py: "2px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(17,19,24,0.85)",
                  backdropFilter: "blur(4px)",
                  zIndex: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  You
                </Typography>
              </Box>

              {/* Muted Mic Indicator */}
              {!micEnabled && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "6px",
                    bottom: "6px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#3a2226",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    border: "1px solid #633238",
                  }}
                >
                  <MicOffIcon
                    sx={{
                      fontSize: "11px",
                      color: "#ff9ca5",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Mobile Live Conversation Card: AI Question & Candidate Answer */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              backgroundColor: "#171a21",
              border: "1px solid #272b33",
              borderRadius: "14px",
              p: { xs: "10px 12px", sm: "14px 16px" },
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "hidden",
            }}
          >
            {/* AI Question Section */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  mb: "4px",
                  flexShrink: 0,
                }}
              >
                <SmartToyIcon
                  sx={{ fontSize: "14px", color: "#356ae6" }}
                />
                <Typography
                  sx={{
                    fontSize: "9px",
                    color: "#858b98",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  AI Interviewer
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  pr: "4px",
                  "&::-webkit-scrollbar": {
                    width: "3px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#353a44",
                    borderRadius: "8px",
                  },
                  scrollbarWidth: "thin",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "13px" },
                    color: "#f1f3f7",
                    lineHeight: 1.55,
                    fontWeight: 500,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {interviewerTranscript}
                </Typography>
              </Box>
            </Box>

            {/* Divider */}
            <Box
              sx={{
                height: "1px",
                backgroundColor: "#272b33",
                width: "100%",
                flexShrink: 0,
              }}
            />

            {/* Candidate Speech Section */}
            <Box
              sx={{
                flexShrink: 0,
                maxHeight: { xs: "72px", sm: "90px" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  mb: "3px",
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MicIcon
                    sx={{ fontSize: "13px", color: "#5ecb8a" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "9px",
                      color: "#858b98",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    You
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {candidateCountdown !== null && candidateCountdown >= 0 && !geminiSpeakingRef.current && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        px: "6px",
                        py: "1px",
                        borderRadius: "4px",
                        backgroundColor:
                          candidateCountdown <= 5
                            ? "rgba(239, 68, 68, 0.2)"
                            : "rgba(230, 155, 53, 0.2)",
                        border: "1px solid",
                        borderColor:
                          candidateCountdown <= 5 ? "#ef4444" : "#e69b35",
                        color:
                          candidateCountdown <= 5 ? "#ff8080" : "#f5b041",
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: "11px" }} />
                      <Typography sx={{ fontSize: "9px", fontWeight: 800 }}>
                        {candidateCountdown}s to answer
                      </Typography>
                    </Box>
                  )}

                  {isSavingTurn && (
                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#7f8794",
                      }}
                    >
                      Saving...
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  overflowY: "auto",
                  pr: "4px",
                  "&::-webkit-scrollbar": {
                    width: "3px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#353a44",
                    borderRadius: "8px",
                  },
                  scrollbarWidth: "thin",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11.5px",
                    color: "#dce0e8",
                    lineHeight: 1.5,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {candidateTranscript}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        /* DESKTOP & LARGE TABLET VIEW: Two-column layout */
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              md: "minmax(0, 1.3fr) minmax(0, 1fr)",
              lg: "minmax(0, 1fr) 360px",
            },
            gap: "16px",
            p: "16px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Left / Primary Column: AI Interviewer & Gemini Transcript */}
          <Box
            sx={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: 0,
            }}
          >
            {/* AI Avatar Card */}
            <Box
              sx={{
                position: "relative",
                flex: 1,
                minHeight: 0,
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "#1b1e24",
                border: "1px solid #272b33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InteractiveAvatar
                status={aiStatus}
                audioLevel={geminiAudioLevel}
              />

              {/* AI Status Badge - Left */}
              <Box
                sx={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  px: "10px",
                  py: "5px",
                  borderRadius: "7px",
                  backgroundColor: "rgba(17,19,24,0.85)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  zIndex: 2,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor:
                      aiStatus === "Speaking"
                        ? "#5ecb8a"
                        : aiStatus === "Thinking"
                          ? "#356ae6"
                          : "#858b98",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  AI Interviewer
                </Typography>
              </Box>

              {/* AI Status Badge - Right */}
              <Box
                sx={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  px: "10px",
                  py: "5px",
                  borderRadius: "7px",
                  backgroundColor: "rgba(17,19,24,0.85)",
                  backdropFilter: "blur(8px)",
                  zIndex: 2,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color:
                      aiStatus === "Speaking"
                        ? "#5ecb8a"
                        : aiStatus === "Thinking"
                          ? "#356ae6"
                          : "#9aa1ad",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {aiStatus}
                </Typography>
              </Box>

              {/* Question Counter Pill */}
              {totalQuestions > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "14px",
                    right: "14px",
                    px: "11px",
                    py: "5px",
                    borderRadius: "7px",
                    backgroundColor: "rgba(17,19,24,0.85)",
                    backdropFilter: "blur(8px)",
                    zIndex: 2,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "#ffffff",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    Question {Math.min(currentQuestion, totalQuestions)} /{" "}
                    {totalQuestions}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Gemini Interviewer Transcript Box */}
            <Box
              sx={{
                flexShrink: 0,
                minHeight: "90px",
                maxHeight: "140px",
                overflowY: "auto",
                px: "16px",
                py: "12px",
                borderRadius: "12px",
                backgroundColor: "#171a20",
                border: "1px solid #272b33",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#353a44",
                  borderRadius: "10px",
                },
                scrollbarWidth: "thin",
              }}
            >
              <Typography
                sx={{
                  fontSize: "8px",
                  color: "#7f8794",
                  fontWeight: 800,
                  mb: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                AI Interviewer
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#f1f3f7",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {interviewerTranscript}
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Candidate Video & Candidate Transcript */}
          <Box
            sx={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: 0,
            }}
          >
            {/* Candidate Video Card */}
            <Box
              sx={{
                position: "relative",
                flex: 1,
                minHeight: 0,
                borderRadius: "14px",
                backgroundColor: "#1b1e24",
                border: "1px solid #272b33",
                overflow: "hidden",
              }}
            >
              <Box
                component="video"
                ref={!isMobile ? videoRef : undefined}
                autoPlay
                muted
                playsInline
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  display: cameraEnabled && mediaReady ? "block" : "none",
                }}
              />

              {(!cameraEnabled || !mediaReady) && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1b1e24",
                  }}
                >
                  <Avatar
                    sx={{
                      width: "72px",
                      height: "72px",
                      backgroundColor: "#2b303a",
                      color: "#9aa1ad",
                      fontSize: "22px",
                      fontWeight: 800,
                    }}
                  >
                    You
                  </Avatar>
                </Box>
              )}

              {/* Candidate "You" Label */}
              <Box
                sx={{
                  position: "absolute",
                  left: "12px",
                  bottom: "12px",
                  px: "9px",
                  py: "4px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(17,19,24,0.85)",
                  backdropFilter: "blur(6px)",
                  zIndex: 2,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  You
                </Typography>
              </Box>

              {/* Muted Mic Indicator */}
              {!micEnabled && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "12px",
                    bottom: "12px",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    backgroundColor: "#3a2226",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    border: "1px solid #633238",
                  }}
                >
                  <MicOffIcon
                    sx={{
                      fontSize: "13px",
                      color: "#ff9ca5",
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Candidate Transcript Box */}
            <Box
              sx={{
                flexShrink: 0,
                minHeight: "90px",
                maxHeight: "140px",
                overflowY: "auto",
                px: "16px",
                py: "12px",
                borderRadius: "12px",
                backgroundColor: "#171a20",
                border: "1px solid #272b33",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#353a44",
                  borderRadius: "10px",
                },
                scrollbarWidth: "thin",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "8px",
                    color: "#7f8794",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  You
                </Typography>

                {candidateCountdown !== null && candidateCountdown >= 0 && !geminiSpeakingRef.current && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      px: "7px",
                      py: "2px",
                      borderRadius: "5px",
                      backgroundColor:
                        candidateCountdown <= 5
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(230, 155, 53, 0.2)",
                      border: "1px solid",
                      borderColor:
                        candidateCountdown <= 5 ? "#ef4444" : "#e69b35",
                      color:
                        candidateCountdown <= 5 ? "#ff8080" : "#f5b041",
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: "12px" }} />
                    <Typography sx={{ fontSize: "10px", fontWeight: 800 }}>
                      {candidateCountdown}s to answer
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#e2e5ea",
                  lineHeight: 1.55,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {candidateTranscript}
              </Typography>
            </Box>

            {/* Status notices */}
            {isSavingTurn && (
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#7f8794",
                  flexShrink: 0,
                  px: "2px",
                }}
              >
                Saving conversation...
              </Typography>
            )}

            {isCompletingInterview && (
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#7f8794",
                  flexShrink: 0,
                  px: "2px",
                }}
              >
                Finishing interview...
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Bottom Controls Bar */}
      <Box
        sx={{
          minHeight: {
            xs: "auto",
            sm: "68px",
          },
          px: { xs: "8px", sm: "18px" },
          py: { xs: "8px", sm: "10px" },
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          borderTop: "1px solid #242830",
          backgroundColor: "#17191e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingBottom: {
            xs: "calc(8px + env(safe-area-inset-bottom, 0px))",
            sm: "10px",
          },
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: {
              xs: "grid",
              sm: "flex",
            },
            gridTemplateColumns: {
              xs: "repeat(4, minmax(0, 1fr))",
              sm: "none",
            },
            rowGap: {
              xs: "6px",
              sm: "0px",
            },
            columnGap: {
              xs: "6px",
              sm: "0px",
            },
            gap: {
              sm: "12px",
            },
            alignItems: "center",
            width: {
              xs: "100%",
              sm: "auto",
            },
            maxWidth: "100%",
            boxSizing: "border-box",
            minWidth: 0,
            justifyContent: "center",
          }}
        >
          {/* Mic Toggle */}
          <IconButton
            onClick={handleToggleMic}
            aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            sx={{
              gridColumn: { xs: "1", sm: "auto" },
              width: { xs: "100%", sm: "44px" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              borderRadius: { xs: "9px", sm: "50%" },
              backgroundColor: micEnabled ? "#252932" : "#a8323e",
              color: "#ffffff",
              border: "1px solid",
              borderColor: micEnabled ? "#343944" : "#b83a47",
              "&:hover": {
                backgroundColor: micEnabled ? "#2f3440" : "#b83a47",
              },
            }}
          >
            {micEnabled ? (
              <MicIcon sx={{ fontSize: "19px" }} />
            ) : (
              <MicOffIcon sx={{ fontSize: "19px" }} />
            )}
          </IconButton>

          {/* Camera Toggle */}
          <IconButton
            onClick={handleToggleCamera}
            aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
            sx={{
              gridColumn: { xs: "2", sm: "auto" },
              width: { xs: "100%", sm: "44px" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              borderRadius: { xs: "9px", sm: "50%" },
              backgroundColor: cameraEnabled ? "#252932" : "#a8323e",
              color: "#ffffff",
              border: "1px solid",
              borderColor: cameraEnabled ? "#343944" : "#b83a47",
              "&:hover": {
                backgroundColor: cameraEnabled ? "#2f3440" : "#b83a47",
              },
            }}
          >
            {cameraEnabled ? (
              <VideocamIcon sx={{ fontSize: "19px" }} />
            ) : (
              <VideocamOffIcon sx={{ fontSize: "19px" }} />
            )}
          </IconButton>

          {/* Speaker Toggle */}
          <IconButton
            onClick={handleToggleSpeaker}
            aria-label={speakerEnabled ? "Mute speaker" : "Unmute speaker"}
            sx={{
              gridColumn: { xs: "3", sm: "auto" },
              width: { xs: "100%", sm: "44px" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              borderRadius: { xs: "9px", sm: "50%" },
              backgroundColor: "#252932",
              color: "#ffffff",
              border: "1px solid #343944",
              "&:hover": {
                backgroundColor: "#2f3440",
              },
            }}
          >
            {speakerEnabled ? (
              <VolumeUpIcon sx={{ fontSize: "19px" }} />
            ) : (
              <VolumeOffIcon sx={{ fontSize: "19px" }} />
            )}
          </IconButton>

          {/* More Actions */}
          <IconButton
            aria-label="More options"
            sx={{
              gridColumn: { xs: "4", sm: "auto" },
              width: { xs: "100%", sm: "44px" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              borderRadius: { xs: "9px", sm: "50%" },
              backgroundColor: "#252932",
              color: "#ffffff",
              border: "1px solid #343944",
              "&:hover": {
                backgroundColor: "#2f3440",
              },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: "20px" }} />
          </IconButton>

          {/* Leave Interview Button */}
          <Button
            onClick={handleLeaveInterview}
            disabled={isCompletingInterview}
            startIcon={
              <LogoutIcon
                sx={{
                  fontSize: "17px !important",
                }}
              />
            }
            sx={{
              gridColumn: { xs: "span 2", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              px: { xs: "8px", sm: "16px" },
              ml: { xs: "0px", sm: "6px" },
              borderRadius: "9px",
              backgroundColor: "#252932",
              color: "#dce0e8",
              border: "1px solid #343944",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: { xs: "12px", sm: "12px" },
              fontWeight: 700,
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "#2f3440",
                borderColor: "#404654",
                color: "#ffffff",
              },
            }}
          >
            Leave Interview
          </Button>

          {/* End Interview Button */}
          <Button
            onClick={handleEndInterview}
            disabled={isCompletingInterview}
            startIcon={
              <CallEndIcon
                sx={{
                  fontSize: "17px !important",
                }}
              />
            }
            sx={{
              gridColumn: { xs: "span 2", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
              height: { xs: "40px", sm: "44px" },
              minWidth: 0,
              px: { xs: "8px", sm: "18px" },
              ml: { xs: "0px", sm: "6px" },
              borderRadius: "9px",
              backgroundColor: "#c53b48",
              color: "#ffffff",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: { xs: "12px", sm: "12px" },
              fontWeight: 800,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(197, 59, 72, 0.3)",
              "&:hover": {
                backgroundColor: "#ad303c",
                boxShadow: "0 4px 12px rgba(197, 59, 72, 0.4)",
              },
            }}
          >
            End
          </Button>
        </Box>

        <Typography
          sx={{
            position: "absolute",
            right: "20px",
            display: {
              xs: "none",
              lg: "block",
            },
            fontSize: "10px",
            color: "#626a77",
            fontWeight: 600,
          }}
        >
          InterviewReady AI
        </Typography>
      </Box>

      {/* Confirmation Modal: Leave Interview (Save & Resume Later) */}
      <Dialog
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1c1f26",
              color: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #2d3340",
              maxWidth: "460px",
              p: 1,
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2, px: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogoutIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
            Leave this interview?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1.5 }}>
          <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
            Your progress will be saved and you can continue this interview later.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 1.8,
              borderRadius: "10px",
              backgroundColor: "#242934",
              border: "1px solid #333a4a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>
              Saved progress:
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#60a5fa" }}>
              {candidateAnswerCountRef.current} / {totalQuestionsRef.current || 20} answered
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1.2, justifyContent: "flex-end" }}>
          <Button
            onClick={() => setShowLeaveModal(false)}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "13px",
              px: 2.5,
              py: 0.9,
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            Continue Interview
          </Button>

          <Button
            onClick={handleConfirmLeave}
            variant="outlined"
            sx={{
              color: "#9ca3af",
              borderColor: "#374151",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              px: 2,
              py: 0.9,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#242934",
                borderColor: "#4b5563",
                color: "#ffffff",
              },
            }}
          >
            Leave Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal: End Interview Below 50% Threshold */}
      <Dialog
        open={showEndEarlyModal}
        onClose={() => setShowEndEarlyModal(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1c1f26",
              color: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #2d3340",
              maxWidth: "460px",
              p: 1,
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2, px: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(230, 155, 53, 0.15)",
              color: "#e69b35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
            End Interview Early?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1.5 }}>
          <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
            Your performance report cannot be generated yet. Please answer at least 50% of the interview questions.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 1.8,
              borderRadius: "10px",
              backgroundColor: "#242934",
              border: "1px solid #333a4a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>
              Progress completed:
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#e69b35" }}>
              {candidateAnswerCountRef.current} / {totalQuestionsRef.current || 20} answered ({Math.ceil((totalQuestionsRef.current || 20) * 0.5)} required)
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1.2, justifyContent: "flex-end" }}>
          <Button
            onClick={handleConfirmEndAnyway}
            sx={{
              color: "#ef4444",
              borderColor: "rgba(239, 68, 68, 0.4)",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              px: 2,
              py: 0.9,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "#ef4444",
              },
            }}
            variant="outlined"
          >
            End Interview Anyway
          </Button>

          <Button
            onClick={() => setShowEndEarlyModal(false)}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "13px",
              px: 2.5,
              py: 0.9,
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            Continue Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Gemini High Demand / Unrecoverable Outage Modal */}
      <Dialog
        open={showHighDemandModal}
        onClose={() => {}}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1c1f26",
              color: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #2d3340",
              maxWidth: "460px",
              p: 1,
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2, px: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CloudQueueIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
            High Service Demand
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1.5 }}>
          <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
            Sorry for the inconvenience. Gemini is currently experiencing high demand. Please continue this interview after 5 minutes.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 1.8,
              borderRadius: "10px",
              backgroundColor: "#242934",
              border: "1px solid #333a4a",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.5 }}>
              Your answered questions and interview progress have been safely saved. You can resume anytime from your Dashboard.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              setShowHighDemandModal(false);
              navigate("/dashboard");
            }}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "13px",
              px: 3,
              py: 1,
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            Return to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewPage;