import gemini from "../config/gemini.js";

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

export const generateInterviewReportWithGemini =
  async ({
    role,
    interviewType,
    difficulty,
    conversation,
  }: InterviewReportInput): Promise<InterviewReportOutput> => {
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
- Do not wrap the JSON in markdown code fences.

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

    const candidateModels = [
      process.env.GEMINI_REPORT_MODEL,
      "gemini-3.8-flash",
    ].filter(Boolean) as string[];

    let responseText = "";
    let lastError: Error | null = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`[Gemini Report] Requesting report generation using model ${modelName}...`);
        const response = await gemini.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text && response.text.trim()) {
          responseText = response.text.trim();
          console.log(`[Gemini Report] Successfully received response from ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini Report] Attempt with model ${modelName} failed:`, err?.message || err);
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    if (!responseText) {
      throw (
        lastError ||
        new Error("Gemini returned an empty interview report response from all candidate models.")
      );
    }

    // Strip markdown code fences if model enclosed JSON
    let cleanJson = responseText;
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    let report: InterviewReportOutput;

    try {
      report = JSON.parse(cleanJson) as InterviewReportOutput;
    } catch {
      // Fallback regex extractor for JSON object if surrounded by preamble
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          report = JSON.parse(jsonMatch[0]) as InterviewReportOutput;
        } catch {
          throw new Error("Gemini returned invalid JSON for the interview report");
        }
      } else {
        throw new Error("Gemini returned invalid JSON for the interview report");
      }
    }

    const scores = [
      report.overallScore,
      report.technicalScore,
      report.communicationScore,
      report.problemSolvingScore,
    ];

    for (const score of scores) {
      if (
        typeof score !== "number" ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100
      ) {
        throw new Error(
          "Gemini returned an invalid report score"
        );
      }
    }

    if (!Array.isArray(report.strengths)) {
      throw new Error(
        "Gemini returned invalid strengths"
      );
    }

    if (!Array.isArray(report.weaknesses)) {
      throw new Error(
        "Gemini returned invalid weaknesses"
      );
    }

    if (!Array.isArray(report.suggestions)) {
      throw new Error(
        "Gemini returned invalid suggestions"
      );
    }

    if (
      typeof report.summary !== "string" ||
      !report.summary.trim()
    ) {
      throw new Error(
        "Gemini returned an invalid summary"
      );
    }

    return report;
  };