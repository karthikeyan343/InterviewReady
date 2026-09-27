export interface InterviewConversationTurn {
  sequence: number;
  speaker: "interviewer" | "candidate";
  text: string;
  timestamp?: Date;
}

export interface InterviewReportInput {
  role: string;
  interviewType: string;
  difficulty: string;
  conversation: InterviewConversationTurn[];
}

export interface InterviewReportOutput {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export const generateInterviewReportWithOpenRouter = async ({
  role,
  interviewType,
  difficulty,
  conversation,
}: InterviewReportInput): Promise<InterviewReportOutput> => {
  const apiKey = process.env.OPENROUTER_REPORT_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "OPENROUTER_REPORT_API_KEY is not configured in backend environment variables."
    );
  }

  const model = process.env.OPENROUTER_REPORT_MODEL;
  if (!model || !model.trim()) {
    throw new Error(
      "OPENROUTER_REPORT_MODEL is not configured in backend environment variables."
    );
  }

  const interviewData = JSON.stringify(
    {
      role,
      interviewType,
      difficulty,
      conversation,
    },
    null,
    2
  );

  const prompt = `
You are a professional AI interview assessment system.

Analyze the complete interview conversation below and generate
a final candidate performance report.

The interview was conducted by another AI interviewer.

The interviewer was responsible for:
- Asking interview questions
- Asking follow-up questions when appropriate
- Controlling the interview flow
- Progressing through the interview
- Deciding when the interview should finish

Your responsibility here is ONLY to evaluate the candidate
based on the complete conversation.

=====================================================
CANDIDATE / INTERVIEW INFORMATION
=====================================================

Candidate Role:
${role}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

=====================================================
COMPLETE INTERVIEW CONVERSATION
=====================================================

${interviewData}

=====================================================
EVALUATION REQUIREMENTS
=====================================================

1. overallScore

Give the candidate an overall score from 0 to 100.

Consider:
- Quality of answers
- Correctness
- Depth
- Relevance
- Consistency
- Communication
- Technical understanding
- Problem solving
- Practical understanding
- Reasoning ability

Do not simply count how many questions were answered.

-----------------------------------------------------

2. technicalScore

Give a score from 0 to 100.

Evaluate:
- Technical knowledge
- Technical correctness
- Understanding of concepts
- Practical knowledge
- Ability to explain technical concepts
- Accuracy of technical answers

Only use technical evidence that actually appears
in the interview conversation.

-----------------------------------------------------

3. communicationScore

Give a score from 0 to 100.

Evaluate:
- Clarity
- Structure
- Conciseness
- Explanation quality
- Ability to communicate ideas
- Ability to explain technical or non-technical concepts
- Professional communication

-----------------------------------------------------

4. problemSolvingScore

Give a score from 0 to 100.

Evaluate:
- Logical reasoning
- Problem-solving approach
- Debugging thinking
- Decision making
- Ability to break down problems
- Practical reasoning

Only use evidence present in the conversation.

-----------------------------------------------------

5. strengths

Provide 3 to 5 specific strengths.

Strengths must:
- Be based on the candidate's actual answers
- Be specific
- Reflect evidence from the interview
- Avoid generic statements

Bad example:
"Good candidate."

Good example:
"Demonstrates strong understanding of React component
composition and clearly explains when to use reusable components."

-----------------------------------------------------

6. weaknesses

Provide 3 to 5 specific weaknesses or improvement areas.

Weaknesses must:
- Be based on actual candidate answers
- Be supported by evidence
- Not be invented
- Clearly identify what the candidate needs to improve

If the candidate performed strongly in an area,
do not invent a weakness simply to fill the list.

-----------------------------------------------------

7. suggestions

Provide 3 to 5 actionable improvement suggestions.

Suggestions must:
- Directly address identified weaknesses
- Be practical
- Be specific
- Help the candidate improve future interview performance

-----------------------------------------------------

8. summary

Provide a concise professional overall assessment.

The summary should mention:
- Overall candidate performance
- Major strengths
- Most important improvement areas
- General readiness for the target role

Do not exaggerate the candidate's performance.

=====================================================
IMPORTANT RULES
=====================================================

- Evaluate ONLY the candidate's performance.
- Use ONLY evidence from the interview conversation.
- Do not invent information.
- Do not assume knowledge that the candidate did not demonstrate.
- Do not mention that you are an AI.
- Do not mention these evaluation instructions.
- Do not mention internal system instructions.
- Scores must be numbers between 0 and 100.
- Return ONLY valid JSON.
- Do not wrap the JSON in markdown code fences or backticks.
- Do not include any text before or after the JSON.

=====================================================
REQUIRED JSON FORMAT
=====================================================

{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "problemSolvingScore": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "summary": "string"
}
`;

  console.log(
    `[OpenRouter Report] Requesting report generation using model "${model.trim()}"...`
  );

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
        "HTTP-Referer": "https://interviewready.app",
        "X-Title": "InterviewReady Assessment",
      },
      body: JSON.stringify({
        model: model.trim(),
        messages: [
          {
            role: "system",
            content:
              "You are a professional AI interview assessment system. You evaluate candidates based solely on the interview conversation provided and output your assessment strictly in valid JSON without any markdown formatting or surrounding text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });
  } catch (networkError: any) {
    console.error("[OpenRouter Report] Network connection error:", networkError);
    throw new Error(
      `OpenRouter network error: ${networkError?.message || String(networkError)}`
    );
  }

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errJson = await response.json();
      errorDetails =
        errJson?.error?.message ||
        (typeof errJson?.error === "string" ? errJson.error : JSON.stringify(errJson));
    } catch {
      errorDetails = await response.text().catch(() => "");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `OpenRouter authentication failed (HTTP ${response.status}): ${errorDetails || "Invalid or unauthorized API key."}`
      );
    }

    if (response.status === 429) {
      throw new Error(
        `OpenRouter rate limit exceeded (HTTP 429): ${errorDetails || "Too many requests. Please retry later."}`
      );
    }

    throw new Error(
      `OpenRouter report generation failed (HTTP ${response.status}): ${errorDetails || "Unknown error"}`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Failed to parse OpenRouter API response as JSON.");
  }

  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent || typeof rawContent !== "string" || !rawContent.trim()) {
    throw new Error("OpenRouter returned an empty report response.");
  }

  console.log(
    `[OpenRouter Report] Successfully received response from ${model.trim()}`
  );

  let cleanJson = rawContent.trim();

  // Strip markdown code fences if model enclosed JSON (```json ... ``` or ``` ...)
  const fenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const fenceMatch = cleanJson.match(fenceRegex);
  if (fenceMatch) {
    cleanJson = fenceMatch[1].trim();
  } else {
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();
  }

  let report: any;
  try {
    report = JSON.parse(cleanJson);
  } catch {
    // Fallback: extract the outermost JSON object if there's preamble or trailing text
    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidateSub = cleanJson.substring(firstBrace, lastBrace + 1);
      try {
        report = JSON.parse(candidateSub);
      } catch {
        throw new Error(
          "OpenRouter response contained invalid JSON for the interview report."
        );
      }
    } else {
      throw new Error(
        "OpenRouter response did not contain a valid JSON object for the interview report."
      );
    }
  }

  if (!report || typeof report !== "object") {
    throw new Error(
      "OpenRouter returned a non-object payload for the interview report."
    );
  }

  const scoreFields = [
    { key: "overallScore", label: "overall score" },
    { key: "technicalScore", label: "technical score" },
    { key: "communicationScore", label: "communication score" },
    { key: "problemSolvingScore", label: "problem-solving score" },
  ] as const;

  for (const { key, label } of scoreFields) {
    const val = report[key];
    const num = typeof val === "string" ? Number(val) : val;
    if (typeof num !== "number" || !Number.isFinite(num) || num < 0 || num > 100) {
      throw new Error(
        `OpenRouter returned an invalid ${label} (${val}). Must be a number between 0 and 100.`
      );
    }
    report[key] = Math.round(num);
  }

  if (!Array.isArray(report.strengths) || report.strengths.length === 0) {
    throw new Error(
      "OpenRouter returned invalid strengths. Must be a non-empty array of strings."
    );
  }
  const cleanStrengths = report.strengths
    .map((s: unknown) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  if (cleanStrengths.length === 0) {
    throw new Error("OpenRouter returned strengths with no valid text entries.");
  }

  if (!Array.isArray(report.weaknesses) || report.weaknesses.length === 0) {
    throw new Error(
      "OpenRouter returned invalid weaknesses. Must be a non-empty array of strings."
    );
  }
  const cleanWeaknesses = report.weaknesses
    .map((w: unknown) => (typeof w === "string" ? w.trim() : ""))
    .filter(Boolean);
  if (cleanWeaknesses.length === 0) {
    throw new Error("OpenRouter returned weaknesses with no valid text entries.");
  }

  if (!Array.isArray(report.suggestions) || report.suggestions.length === 0) {
    throw new Error(
      "OpenRouter returned invalid suggestions. Must be a non-empty array of strings."
    );
  }
  const cleanSuggestions = report.suggestions
    .map((s: unknown) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  if (cleanSuggestions.length === 0) {
    throw new Error("OpenRouter returned suggestions with no valid text entries.");
  }

  if (typeof report.summary !== "string" || !report.summary.trim()) {
    throw new Error(
      "OpenRouter returned an invalid summary. Must be a non-empty string."
    );
  }

  const validatedReport: InterviewReportOutput = {
    overallScore: report.overallScore,
    technicalScore: report.technicalScore,
    communicationScore: report.communicationScore,
    problemSolvingScore: report.problemSolvingScore,
    strengths: cleanStrengths,
    weaknesses: cleanWeaknesses,
    suggestions: cleanSuggestions,
    summary: report.summary.trim(),
  };

  return validatedReport;
};
