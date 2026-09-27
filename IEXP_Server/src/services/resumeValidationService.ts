export interface ResumeValidationResult {
  isResume: boolean;
  confidence: number;
  reason: string;
}

export const RESUME_CONFIDENCE_THRESHOLD = 0.7;

/**
 * Layer 1: Deterministic validation of extracted text.
 * Checks for text existence, length, readability, and candidate/resume signals.
 */
export const validateResumeTextDeterministic = (
  rawText: string
): ResumeValidationResult => {
  if (!rawText || typeof rawText !== "string") {
    return {
      isResume: false,
      confidence: 0,
      reason: "No readable text could be found in the document.",
    };
  }

  const trimmedText = rawText.trim();

  if (!trimmedText) {
    return {
      isResume: false,
      confidence: 0,
      reason: "Extracted document text is completely blank or whitespace.",
    };
  }

  // Reject extremely short text (< 20 words or < 80 characters)
  const words = trimmedText.split(/\s+/).filter(Boolean);
  if (trimmedText.length < 80 || words.length < 20) {
    return {
      isResume: false,
      confidence: 0,
      reason: "Document content is too brief to constitute a resume.",
    };
  }

  // Check for corrupted or non-printable character prevalence (> 30% control/replacement characters)
  const nonPrintableChars = trimmedText.replace(
    /[\x20-\x7E\t\n\r\u00A0-\u024F\u1E00-\u1EFF]/g,
    ""
  );
  if (trimmedText.length > 0 && nonPrintableChars.length / trimmedText.length > 0.3) {
    return {
      isResume: false,
      confidence: 0,
      reason: "Document text appears to be corrupted or unreadable.",
    };
  }

  // Check for candidate contact signals
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
  const profileRegex = /(?:linkedin\.com|github\.com|portfolio|gitlab\.com)/i;

  const hasContactSignal =
    emailRegex.test(trimmedText) ||
    phoneRegex.test(trimmedText) ||
    profileRegex.test(trimmedText);

  // Check for common resume sections (freshers might not have work experience, but will have others)
  const educationRegex =
    /\b(education|academic|bachelor|master|b\.?tech|b\.?e|b\.?sc|b\.?ca|m\.?tech|m\.?s|m\.?ca|university|college|gpa|cgpa|school|degree|diploma|coursework)\b/i;
  const experienceRegex =
    /\b(experience|work experience|employment|internship|work history|professional experience|job responsibilities)\b/i;
  const skillsRegex =
    /\b(skills?|technical skills|technologies|proficiencies|programming languages|frameworks|tools|competencies)\b/i;
  const projectsRegex =
    /\b(projects?|academic projects?|personal projects?|key projects?)\b/i;
  const certificationsRegex =
    /\b(certifications?|certificates?|certified|licenses?|courses?)\b/i;
  const summaryRegex =
    /\b(summary|objective|career objective|professional summary|about me|profile)\b/i;
  const achievementsRegex =
    /\b(achievements?|awards?|honors?|publications?|extracurricular)\b/i;

  const detectedSections = [
    educationRegex.test(trimmedText),
    experienceRegex.test(trimmedText),
    skillsRegex.test(trimmedText),
    projectsRegex.test(trimmedText),
    certificationsRegex.test(trimmedText),
    summaryRegex.test(trimmedText),
    achievementsRegex.test(trimmedText),
  ].filter(Boolean).length;

  // If no contact signals and zero resume sections are detected, reject immediately
  if (!hasContactSignal && detectedSections === 0) {
    return {
      isResume: false,
      confidence: 0,
      reason:
        "The document does not contain candidate contact details or standard resume sections.",
    };
  }

  return {
    isResume: true,
    confidence: 0.5,
    reason: "Deterministic checks passed. Meaningful resume signals detected.",
  };
};

/**
 * Layer 2: Semantic AI validation using OpenRouter.
 * Evaluates whether the document is a genuine candidate resume/CV.
 * Rejects ads, brochures, certificates, invoices, notices, assignments, etc.
 */
export const validateResumeTextSemantic = async (
  extractedText: string
): Promise<ResumeValidationResult> => {
  const apiKey = process.env.OPENROUTER_RESUME_VALIDATION_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "OPENROUTER_RESUME_VALIDATION_API_KEY is not configured in backend environment variables."
    );
  }

  const model = process.env.OPENROUTER_RESUME_VALIDATION_MODEL;
  if (!model || !model.trim()) {
    throw new Error(
      "OPENROUTER_RESUME_VALIDATION_MODEL is not configured in backend environment variables."
    );
  }

  // Send only the text needed for classification (up to 5,000 characters)
  const sampleText = extractedText.trim().slice(0, 5000);

  const prompt = `
You are an expert AI resume classifier.
Analyze the following extracted document text and determine whether it is a genuine candidate resume or curriculum vitae (CV).

=====================================================
DOCUMENT TEXT (TRUNCATED):
=====================================================
${sampleText}
=====================================================

CLASSIFICATION RULES:
1. A valid resume/CV is a document created by an individual candidate to present their background, contact information, education, work experience, projects, skills, or achievements for employment or internship opportunities.
2. Fresh graduate resumes might lack professional work experience, but will typically include education, skills, projects, and contact info.
3. You MUST REJECT:
   - Advertisements, promotional flyers, brochures, marketing material
   - Course completion certificates, degree certificates, award certificates
   - Invoices, receipts, bills, bank statements, financial records
   - Event notices, circulars, memos, announcements, meeting agendas
   - Research papers, essays, articles, blog posts, books
   - School/college assignments, homework, lab reports
   - Blank documents, random notes, non-resume text or PDFs
4. Output MUST be valid JSON ONLY matching this schema:
{
  "isResume": true,
  "confidence": 0.95,
  "reason": "concise explanation of why this document is or is not a resume"
}

Do not include any markdown formatting, backticks, or other text outside the JSON object.
`;

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
        "HTTP-Referer": "https://interviewready.app",
        "X-Title": "InterviewReady Resume Validation",
      },
      body: JSON.stringify({
        model: model.trim(),
        messages: [
          {
            role: "system",
            content:
              "You are a strict resume validation assistant. You evaluate whether a document text belongs to a genuine candidate resume/CV. Output ONLY a valid JSON object without markdown formatting or code blocks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
      }),
    });
  } catch (networkError: any) {
    console.error(
      "[Resume Validation] Network connection error:",
      networkError
    );
    throw new Error(
      `Resume validation network error: ${
        networkError?.message || String(networkError)
      }`
    );
  }

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errJson = await response.json();
      errorDetails =
        errJson?.error?.message ||
        (typeof errJson?.error === "string"
          ? errJson.error
          : JSON.stringify(errJson));
    } catch {
      errorDetails = await response.text().catch(() => "");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `Resume validation authentication failed (HTTP ${response.status}): ${
          errorDetails || "Invalid or unauthorized API key."
        }`
      );
    }

    if (response.status === 429) {
      throw new Error(
        `Resume validation rate limit exceeded (HTTP 429): ${
          errorDetails || "Too many requests. Please retry later."
        }`
      );
    }

    throw new Error(
      `Resume validation API failed (HTTP ${response.status}): ${
        errorDetails || "Unknown error"
      }`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Failed to parse resume validation API response as JSON.");
  }

  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent || typeof rawContent !== "string" || !rawContent.trim()) {
    throw new Error("Resume validation model returned an empty response.");
  }

  let cleanJson = rawContent.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ...)
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

  let parsed: any;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    // Fallback: extract the outermost JSON object
    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidateSub = cleanJson.substring(firstBrace, lastBrace + 1);
      try {
        parsed = JSON.parse(candidateSub);
      } catch {
        throw new Error(
          "Resume validation response contained invalid JSON."
        );
      }
    } else {
      throw new Error(
        "Resume validation response did not contain a valid JSON object."
      );
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(
      "Resume validation returned a non-object JSON payload."
    );
  }

  if (typeof parsed.isResume !== "boolean") {
    throw new Error(
      "Resume validation response is missing a valid boolean 'isResume' field."
    );
  }

  const confidence = Number(parsed.confidence);
  if (isNaN(confidence) || confidence < 0 || confidence > 1) {
    throw new Error(
      "Resume validation response is missing a valid 'confidence' number between 0 and 1."
    );
  }

  const reason =
    typeof parsed.reason === "string" && parsed.reason.trim()
      ? parsed.reason.trim()
      : parsed.isResume
      ? "Valid resume identified."
      : "The document does not appear to be a candidate resume.";

  return {
    isResume: parsed.isResume,
    confidence,
    reason,
  };
};

/**
 * Validates extracted resume text using a two-layer validation strategy:
 * Layer 1: Deterministic structure and keyword checks.
 * Layer 2: Semantic AI classification via OpenRouter.
 */
export const validateResume = async (
  extractedText: string
): Promise<ResumeValidationResult> => {
  // Layer 1: Deterministic validation
  const deterministicResult = validateResumeTextDeterministic(extractedText);
  if (!deterministicResult.isResume) {
    return deterministicResult;
  }

  // Layer 2: Semantic AI validation
  return await validateResumeTextSemantic(extractedText);
};
