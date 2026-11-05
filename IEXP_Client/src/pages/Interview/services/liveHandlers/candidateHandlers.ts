import type { LiveHandlerContext } from "./types";

export const createCandidateHandlers = (
  ctx: LiveHandlerContext,
  generation?: number
) => {
  const isStale = () =>
    generation !== undefined &&
    generation !== ctx.connectionGenerationRef.current;

  const onCandidateSpeechStart = () => {
    if (isStale()) {
      return;
    }

    if (
      ctx.candidateTurnFinalizedForCurrentQuestionRef.current ||
      ctx.geminiSpeakingRef.current ||
      !ctx.startedRef.current
    ) {
      console.log(
        `[Live Interview] Candidate speech start ignored (finalized=${ctx.candidateTurnFinalizedForCurrentQuestionRef.current}, geminiSpeaking=${ctx.geminiSpeakingRef.current}, started=${ctx.startedRef.current})`
      );
      return;
    }

    ctx.isCandidateSpeakingTurnRef.current = true;
    console.log(
      `[CandidateAudioTrace] onCandidateSpeechStart handler triggered at timestamp: ${Date.now()}`
    );
    console.log("[Live Interview] Candidate speech started.");
    ctx.clearCandidateNoAnswerTimeout();
    ctx.setShowNoAnswerReminderModal(false);
    ctx.clearGeminiIdleWatchdog();
    ctx.setCandidateTranscript("");
    ctx.setAiStatus("Listening");
  };

  const onInputTranscript = (text: string) => {
    if (isStale()) {
      return;
    }

    if (
      !ctx.geminiSpeakingRef.current &&
      !ctx.interviewCompletedRef.current &&
      !ctx.candidateTurnFinalizedForCurrentQuestionRef.current
    ) {
      ctx.setAiStatus("Listening");
      ctx.isCandidateSpeakingTurnRef.current = true;
      ctx.clearCandidateNoAnswerTimeout();
      ctx.setShowNoAnswerReminderModal(false);
      console.log(
        `[CandidateAudioTrace] onInputTranscript handler received text length: ${text.length}`
      );
      console.log(
        `[Live Interview] Candidate transcript received for Question ${ctx.interviewerQuestionCountRef.current}: "${text.substring(0, 50)}..."`
      );
      ctx.setCandidateTranscript(text);
    }
  };

  const onCandidateTurnReset = () => {
    if (isStale()) {
      return;
    }
    ctx.isCandidateSpeakingTurnRef.current = false;
    if (
      !ctx.geminiSpeakingRef.current &&
      !ctx.interviewCompletedRef.current &&
      !ctx.candidateTurnFinalizedForCurrentQuestionRef.current
    ) {
      ctx.setAiStatus("Listening");
      ctx.startCandidateNoAnswerTimeout();
    }
  };

  const onCandidateTurnEnd = (text: string) => {
    if (isStale()) {
      return;
    }

    ctx.clearCandidateNoAnswerTimeout();
    ctx.setShowNoAnswerReminderModal(false);

    const cleanedText = text.trim();
    if (!cleanedText || ctx.interviewCompletedRef.current) {
      return;
    }

    if (ctx.candidateTurnFinalizedForCurrentQuestionRef.current) {
      console.warn(
        `[Live Interview] Discarding late/duplicate candidate transcript for Question ${ctx.interviewerQuestionCountRef.current} because question was already finalized: "${cleanedText}"`
      );
      ctx.isCandidateSpeakingTurnRef.current = false;
      return;
    }

    if (ctx.lastSavedCandidateTextRef.current === cleanedText) {
      return;
    }

    ctx.candidateTurnFinalizedForCurrentQuestionRef.current = true;
    ctx.lastSavedCandidateTextRef.current = cleanedText;
    ctx.candidateAnswerCountRef.current += 1;
    ctx.isCandidateSpeakingTurnRef.current = false;

    ctx.liveServiceRef.current?.setCandidateTurnState("SAVING_ANSWER");

    console.log(
      `[CandidateAudioTrace] onCandidateTurnEnd invoked in InterviewPage: candidate text length=${cleanedText.length}, questionNumber=${ctx.interviewerQuestionCountRef.current}`
    );
    console.log(
      `[Live Interview] Candidate turn submitted for Question ${ctx.interviewerQuestionCountRef.current}: "${cleanedText}"`
    );

    ctx.setCandidateTranscript(cleanedText);
    ctx.setAiStatus("Thinking");

    void ctx
      .saveConversationTurn("candidate", cleanedText, false)
      .catch((err) => {
        console.warn("Error saving candidate turn:", err);
      });

    const target = ctx.totalQuestionsRef.current || 20;
    if (ctx.candidateAnswerCountRef.current >= target) {
      console.log(
        `[Live Interview] Target questions answered (${ctx.candidateAnswerCountRef.current}/${target}). Requesting closing statement.`
      );
      ctx.waitingForClosingStatementRef.current = true;
      ctx.liveServiceRef.current?.sendText(
        `The candidate has answered Question ${target}, which is the final question of the interview. Do NOT ask another question. Give a short, warm, professional closing statement concluding the interview: "Thank you for attending the interview. That concludes the interview." Then stop speaking.`
      );
    }

    ctx.startGeminiIdleWatchdog();
  };

  return {
    onCandidateSpeechStart,
    onInputTranscript,
    onCandidateTurnReset,
    onCandidateTurnEnd,
  };
};
