interface ResumePromptOptions {
  target: number;
  currentQ: number;
  answeredQ: number;
  lastQ: string;
  previousTurns: string;
  sessionRole: string;
  sessionType: string;
  sessionDifficulty: string;
}

export const buildResumePrompt = ({
  target,
  currentQ,
  answeredQ,
  lastQ,
  previousTurns,
  sessionRole,
  sessionType,
  sessionDifficulty,
}: ResumePromptOptions): string => {
  return `Resume the ongoing interview now.

${sessionRole ? `Role: ${sessionRole}\n` : ""}${sessionType ? `Interview Type: ${sessionType}\n` : ""}${sessionDifficulty ? `Difficulty: ${sessionDifficulty}\n` : ""}Target total questions: EXACTLY ${target} questions.

${previousTurns ? `CONVERSATION HISTORY SO FAR:\n${previousTurns}\n` : ""}
CURRENT STATUS:
- Total target questions: ${target}
- Questions already asked: ${currentQ}
- Candidate answers received: ${answeredQ}
${lastQ ? `- Most recent question asked: "${lastQ}"` : ""}

CRITICAL INSTRUCTIONS:
1. Review the conversation history above. You are continuing this exact ${sessionType ? `${sessionType} ` : ""}interview for the role of ${sessionRole || "the candidate"}.
2. Do NOT restart from Question 1. Do NOT greet or introduce yourself again.
3. Every question counts toward the total of ${target}.
4. Remaining questions to ask: ${Math.max(0, target - currentQ)}.
${
  currentQ > answeredQ
    ? `5. The candidate has not answered Question ${currentQ} yet. Re-state Question ${currentQ} briefly and clearly, then wait for their answer.`
    : `5. Ask Question ${currentQ + 1} now based on the previous conversation and the ${sessionType || "interview"} requirements.`
}
6. Ask exactly ONE question at a time and wait for the candidate's answer before proceeding.
7. When all ${target} questions have been answered, conclude with: "Thank you. The interview is now complete." and stop speaking.`;
};

interface SystemInstructionOptions {
  target: number;
  sessionRole: string;
  sessionType: string;
  sessionDifficulty: string;
}

export const buildSystemInstructionPrompt = ({
  target,
  sessionRole,
  sessionType,
  sessionDifficulty,
}: SystemInstructionOptions): string => {
  return `Begin the interview now.

You are the sole AI interviewer and you control the entire interview.

${sessionRole ? `Target Role: ${sessionRole}\n` : ""}${sessionType ? `Interview Type: ${sessionType}\n` : ""}${sessionDifficulty ? `Difficulty: ${sessionDifficulty}\n` : ""}You control:
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

Begin the interview now with a brief professional introduction and Question 1.`;
};
