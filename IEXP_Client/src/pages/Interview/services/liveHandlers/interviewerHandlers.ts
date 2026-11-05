import type { LiveHandlerContext } from "./types";

export const createInterviewerHandlers = (
  ctx: LiveHandlerContext,
  generation?: number
) => {
  const isStale = () =>
    generation !== undefined &&
    generation !== ctx.connectionGenerationRef.current;

  const onOutputTranscript = (text: string) => {
    if (isStale()) {
      return;
    }

    const cleanedText = text.trim();
    if (cleanedText) {
      ctx.setInterviewerTranscript(cleanedText);
    }

    ctx.liveServiceRef.current?.setSpeakerEnabled(ctx.speakerEnabled);

    if (!ctx.geminiSpeakingRef.current) {
      ctx.setAiStatus("Thinking");
    }
  };

  const onSpeakingStart = () => {
    if (isStale()) {
      return;
    }

    ctx.geminiSpeakingRef.current = true;
    ctx.geminiMeaningfulProgressRef.current = true;
    ctx.clearCandidateNoAnswerTimeout();
    ctx.setShowNoAnswerReminderModal(false);
    ctx.clearGeminiIdleWatchdog();
    ctx.setInterviewerTranscript("");
    ctx.liveServiceRef.current?.pauseMicrophone();
    ctx.setAiStatus("Speaking");
  };

  const onTurnComplete = (completeText: string) => {
    if (isStale()) {
      return;
    }

    const cleanedText = completeText.trim();
    if (!cleanedText) return;

    ctx.geminiMeaningfulProgressRef.current = true;
    ctx.setInterviewerTranscript(cleanedText);
    ctx.clearGeminiIdleWatchdog();

    if (ctx.lastSavedInterviewerTextRef.current === cleanedText) {
      return;
    }
    ctx.lastSavedInterviewerTextRef.current = cleanedText;

    if (ctx.isReStatingPendingQuestionRef.current) {
      ctx.isReStatingPendingQuestionRef.current = false;
      ctx.candidateTurnFinalizedForCurrentQuestionRef.current = false;
      console.log(
        `[Live Interview] Re-stated unanswered Question ${ctx.interviewerQuestionCountRef.current}. Question count preserved.`
      );

      ctx.setCurrentQuestion(ctx.interviewerQuestionCountRef.current);

      void ctx
        .saveConversationTurn("interviewer", cleanedText, false)
        .catch((err) => {
          console.warn("Error saving re-stated interviewer turn:", err);
        });

      return;
    }

    const target = ctx.totalQuestionsRef.current || 20;
    const lowerText = cleanedText.toLowerCase();
    const isClosingStatement =
      ctx.waitingForClosingStatementRef.current ||
      ctx.candidateAnswerCountRef.current >= target ||
      lowerText.includes("interview is now complete") ||
      lowerText.includes("concludes the interview") ||
      lowerText.includes("concludes our interview") ||
      lowerText.includes("that concludes") ||
      lowerText.includes("thank you for attending");

    const isQuestion = !isClosingStatement;

    if (isQuestion) {
      ctx.candidateTurnFinalizedForCurrentQuestionRef.current = false;

      ctx.interviewerQuestionCountRef.current += 1;
      const questionNumber = ctx.interviewerQuestionCountRef.current;
      ctx.setCurrentQuestion(questionNumber);

      if (questionNumber > target) {
        console.warn(
          `[Live Interview] Question count limit reached (${questionNumber} > ${target}). Requesting closing statement.`
        );
        ctx.waitingForClosingStatementRef.current = true;
        ctx.liveServiceRef.current?.sendText(
          `You have reached the required limit of ${target} questions. Do NOT ask any more questions. Give a short closing statement: "Thank you for attending the interview. That concludes the interview." and stop speaking.`
        );
        return;
      }
    }

    void ctx
      .saveConversationTurn("interviewer", cleanedText, isQuestion)
      .catch((err) => {
        console.warn("Error saving interviewer turn:", err);
      });

    if (!isClosingStatement) {
      return;
    }

    const observedQuestions = ctx.interviewerQuestionCountRef.current;
    if (
      observedQuestions < target &&
      ctx.candidateAnswerCountRef.current < target
    ) {
      console.warn(
        `[Live Interview] Gemini attempted to finish early (${observedQuestions}/${target}). Asking it to continue.`
      );
      ctx.continuationRequestedRef.current = true;
      ctx.liveServiceRef.current?.sendText(
        `Do not end the interview yet. You have asked only ${observedQuestions} of the required ${target} total questions. Every follow-up question counts toward the same total. Ask Question ${observedQuestions + 1} now.`
      );
      return;
    }

    ctx.pendingCompletionRef.current = true;

    if (!ctx.geminiSpeakingRef.current && !ctx.interviewCompletedRef.current) {
      ctx.completeInterview();
    }
  };

  const onAudioLevel = (level: number) => {
    if (isStale()) {
      return;
    }

    ctx.setGeminiAudioLevel(level);
  };

  const onSpeakingEnd = () => {
    if (isStale()) {
      return;
    }

    ctx.geminiSpeakingRef.current = false;
    ctx.setGeminiAudioLevel(0);
    ctx.clearGeminiIdleWatchdog();

    if (ctx.pendingCompletionRef.current && !ctx.interviewCompletedRef.current) {
      console.log(
        "[Live Interview] Gemini closing statement audio playback finished. Completing interview."
      );
      ctx.completeInterview();
      return;
    }

    if (ctx.micEnabled && ctx.liveServiceRef.current?.isConnected()) {
      ctx.liveServiceRef.current?.resumeMicrophone();
    }

    if (
      !ctx.interviewCompletedRef.current &&
      !ctx.candidateTurnFinalizedForCurrentQuestionRef.current
    ) {
      ctx.setAiStatus("Listening");
      ctx.startCandidateNoAnswerTimeout();
    }
  };

  return {
    onOutputTranscript,
    onSpeakingStart,
    onTurnComplete,
    onAudioLevel,
    onSpeakingEnd,
  };
};
