import type { LiveHandlerContext, ResumeSessionData } from "./types";
import { buildResumePrompt, buildSystemInstructionPrompt } from "./prompts";

export const createConnectionHandlers = (
  ctx: LiveHandlerContext,
  isResume = false,
  targetLimitOverride?: number,
  resumeSessionData?: ResumeSessionData | null,
  generation?: number
) => {
  const isStale = () =>
    generation !== undefined &&
    generation !== ctx.connectionGenerationRef.current;

  const onOpen = async () => {
    if (isStale()) {
      console.log(
        "[Live Interview] Stale onOpen discarded from older connection."
      );
      return;
    }

    const stream = ctx.streamRef.current;
    if (!stream) {
      throw new Error("Microphone stream is not available.");
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error("Microphone audio track is not available.");
    }

    ctx.setAiStatus("Thinking");
    await ctx.liveServiceRef.current?.startMicrophone(stream);
    ctx.liveServiceRef.current?.setSpeakerEnabled(ctx.speakerEnabled);

    if (!ctx.micEnabled) {
      ctx.liveServiceRef.current?.pauseMicrophone();
    }

    const target =
      targetLimitOverride || ctx.totalQuestionsRef.current || 20;
    const currentQ = ctx.interviewerQuestionCountRef.current;
    const answeredQ = ctx.candidateAnswerCountRef.current;

    const sessionRole = resumeSessionData?.interview?.role || "";
    const sessionType = resumeSessionData?.interview?.interviewType || "";
    const sessionDifficulty =
      resumeSessionData?.interview?.difficulty || "";

    if (isResume || currentQ > 0) {
      const isReStating = Boolean(isResume && currentQ > answeredQ);
      ctx.isReStatingPendingQuestionRef.current = isReStating;

      const lastQ =
        resumeSessionData?.lastInterviewerTurn ||
        ctx.lastSavedInterviewerTextRef.current ||
        "";

      const previousTurns = Array.isArray(resumeSessionData?.turns)
        ? resumeSessionData.turns
            .filter(
              (t) =>
                typeof t.text === "string" && t.text.trim().length > 0
            )
            .map(
              (t) =>
                `${
                  t.speaker === "interviewer"
                    ? "AI Interviewer"
                    : "Candidate"
                }: "${t.text ? t.text.trim() : ""}"`
            )
            .join("\n")
        : "";

      const resumePrompt = buildResumePrompt({
        target,
        currentQ,
        answeredQ,
        lastQ,
        previousTurns,
        sessionRole,
        sessionType,
        sessionDifficulty,
      });

      console.log(
        `[Live Interview] Sending resume prompt to Gemini (Questions asked: ${currentQ}, Answers: ${answeredQ})`
      );
      ctx.liveServiceRef.current?.sendText(resumePrompt);
    } else if (!ctx.geminiSystemInstructionSentRef.current) {
      ctx.geminiSystemInstructionSentRef.current = true;

      const systemPrompt = buildSystemInstructionPrompt({
        target,
        sessionRole,
        sessionType,
        sessionDifficulty,
      });

      ctx.liveServiceRef.current?.sendText(systemPrompt);
    }
  };

  const onError = (liveError: Event | Error) => {
    if (isStale()) {
      return;
    }

    if (ctx.isLeavingRef.current) {
      return;
    }

    console.error("Gemini Live error:", liveError);
    ctx.clearCandidateNoAnswerTimeout();
    ctx.clearGeminiIdleWatchdog();
    if (ctx.startedRef.current && !ctx.interviewCompletedRef.current) {
      void ctx.handleReconnect();
    } else {
      ctx.setAiStatus("Thinking");
      ctx.setError(
        liveError instanceof Error
          ? liveError.message
          : "Unable to connect to the AI interviewer."
      );
    }
  };

  const onClose = () => {
    if (isStale()) {
      return;
    }

    if (ctx.isLeavingRef.current) {
      return;
    }

    console.log("Gemini Live WebSocket closed.");
    ctx.clearCandidateNoAnswerTimeout();
    ctx.clearGeminiIdleWatchdog();
    if (
      ctx.startedRef.current &&
      !ctx.interviewCompletedRef.current &&
      !ctx.isLeavingRef.current
    ) {
      void ctx.handleReconnect();
    }
  };

  return {
    onOpen,
    onError,
    onClose,
  };
};

