import type { LiveHandlerContext, ResumeSessionData } from "./types";
import { createConnectionHandlers } from "./connectionHandlers";
import { createCandidateHandlers } from "./candidateHandlers";
import { createInterviewerHandlers } from "./interviewerHandlers";

export const createLiveHandlers = (
  ctx: LiveHandlerContext,
  isResume = false,
  targetLimitOverride?: number,
  resumeSessionData?: ResumeSessionData | null,
  generation?: number
) => {
  const connectionHandlers = createConnectionHandlers(
    ctx,
    isResume,
    targetLimitOverride,
    resumeSessionData,
    generation
  );

  const candidateHandlers = createCandidateHandlers(ctx, generation);

  const interviewerHandlers = createInterviewerHandlers(ctx, generation);

  return {
    ...connectionHandlers,
    ...candidateHandlers,
    ...interviewerHandlers,
  };
};

export default createLiveHandlers;

